Ext.ns("Ext.plugins.TDGi");
/**
 * copyright (c) TDG innovations, LLC http://tdg-i.com
 * license : PanelHeaderToolbar Ext JS plugin by Jesus Garcia is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 United States License.
             Based on a work at tdg-i.com.
             Permissions beyond the scope of this license may be available at http://tdg-i.com.
 */
Ext.plugins.TDGi.PanelHeaderToolbar = Ext.extend(Object, {
    /**
     * @config {boolean} showRealButtons - shows real buttons instead of toolbar buttons.
     *
     * @param config
     */

    /**
     * @public constructor
     * @param config Object
     */
    constructor : function(config) {
        this.config = config || {};
        Ext.apply(this, this.config);
    },
    /**
     * @public init Public initialization method
     * @param parent
     */
    init : function(parent) {
        parent.on({
            scope    : this,
            destroy  : this.destroy,
            render   : function(panel) {
                if (parent.header) {
                    this.parent = parent;
                    Ext.apply(this.parent, this.parentOverrides);
                    this.doHbar();
                    panel.headerToolbar = this.headerToolbar;
                    panel.hbarEl        = this.hbarEl;

                    this.hbarEl.setWidth(panel.getWidth());
                }
            }
        });
    },
    /**
     * @public doHBar Method that injects the hbar element
     *                and injects or overrides parent functionality
     */
    doHbar : function() {
        this.hbarEl =  this.parent.addHbarElement();
        if (this.config) {
            Ext.apply(this.config, {
                renderTo : this.hbarEl,
                cls      : 'panelHeader',
                hbarEl   : this.hbarEl
            });
            this.headerToolbar = new Ext.Toolbar(this.config);
            this.headerToolbar.ownerCt = this.parent;


            if (this.showRealButtons) {
                this.headerToolbar.el.removeClass('x-toolbar');
            }
            else {
                this.headerToolbar.el.setStyle({
                    'padding-left' : '0px'
                });
            }
        }

    },
    /**
     * @private
     * @destroy destroys the hbar Toolbar component
     */
    destroy : function () {
        if (this.headerToolbar) {
            this.headerToolbar.destroy();
        }
    },

    /**
     * @public hbarExpand
     */
    hbarExpand : function () {
        if (this.headerToolbar) {

            var parent = this.parent;

            if (parent.animCollapse) {
                this.hbarEl.slideIn(parent.slideAnchor, {
                    callback : this.onAfterHbarExpand,
                    scope    : this
                });
            }
            else {
                this.hbarEl.setHeight(this.origHbarElHeight || 24);
                this.onAfterHbarExpand();
            }
        }
    },

    /**
     * @public parentOverrides
     */
    parentOverrides : {
        addHbarElement : function() {
            this.hbarEl = this.header.createChild();
            return this.hbarEl;
        },

        onResize : function(w, h){
            Ext.Panel.prototype.onResize.apply(this, arguments);
            if(w !== undefined || h !== undefined){
                if(!this.collapsed){

                    //Resize the header Bar Element and component
                    if(this.hbarEl){
                        if(this.headerToolbar){
                            var hbarWidth = (this.frame && this instanceof Ext.Panel) ? w : w - 10;
                            if (Ext.isIE7 || Ext.isIE8) {
//                                this.hbarEl.setWidth(w);
                                var width =  hbarWidth - ( (this.frame) ? 14 : 0);
                                this.headerToolbar.setWidth(width);
                                this.hbarEl.setWidth(width);
                            }
                            else {
                                var newWidth = hbarWidth - ( (this.frame) ? 12 : 0);
                                this.hbarEl.setWidth(newWidth);
                                this.headerToolbar.setWidth(newWidth);
                            }
                        }
                    }
                }
            }
            this.syncShadow();
        },
        // @override
        // private
        onCollapse : function(doAnim, animArg){
            if(doAnim){
                if (this.hbarEl && this.headerToolbar && this.headerToolbar.collapseWithParent) {
                   this.origHbarElHeight = this.hbarEl.getHeight();

                   this.hbarEl.slideOut(this.slideAnchor,
                        Ext.apply(this.createEffect(animArg || true, this.onAfterHbarElCollapse, this),
                                this.collapseDefaults));
                }
            }
            else {
                this.hbarEl.hide();
            }
            Ext.Panel.prototype.onCollapse.apply(this, arguments);

        },
        // private @extension
        onAfterHbarElCollapse : function() {
            this.hbarEl.setHeight(0);
            this.hbarEl.hide();

            // Fix the collapsing for IE only
            if (Ext.isIE7 || Ext.isIE8) {
                this.hbarEl.dom.style.display = "none";
            }
        },
        // @override onExpand Slide in the hbarEl if animation is present.
        // private
        onExpand : function(doAnim, animArg){
            if(doAnim){
               if (this.hbarEl && this.headerToolbar && this.headerToolbar.collapseWithParent) {
                   this.hbarEl.slideIn(this.slideAnchor,
                        Ext.apply(this.createEffect(animArg || true, this.onAfterHbarElExpand, this),
                                this.collapseDefaults));
                }
                this[this.collapseEl].slideIn(this.slideAnchor,
                        Ext.apply(this.createEffect(animArg||true, this.afterExpand, this),
                            this.expandDefaults));
            }
            else {
                this.onAfterHbarElExpand();
            }
            Ext.Panel.prototype.onExpand.apply(this, arguments);
        },
        //private @extension
        onAfterHbarElExpand: function () {
           this.hbarEl.setHeight(this.origHbarElHeight || 24);
           this.hbarEl.show();
        }
    }
});

Ext.preg('header_toolbar', Ext.plugins.TDGi.PanelHeaderToolbar);