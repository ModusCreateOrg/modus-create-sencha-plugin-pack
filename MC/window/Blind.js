/*
    Author       : Jay Garcia
    Site         : http://moduscreate.com
    Contact Info : jay@moduscreate.com
    Purpose      : Window Blinds for Ext 4.1 Ext.Window class, which emulates OS X behavior.
    Warranty     : none
    License      : MIT,
    Price        : free
    Version      : 1.1
    Date         : 05/05/2011
*/



 /**
 * @class MC.window.WindowBlind
 * @extends Ext.panel.Panel
 * <p>Window Blinds for Ext 4.x Ext.window.Window class, which emulates OS X behavior.</p>
 * @constructor
 * @param {Object} config The config object
 * @xtype MC.window.WindowBlind
 */
Ext.define('MC.window.Blind',{
    extend    : 'Ext.panel.Panel',
    height    : 100,
    alias     : 'plugin.blind',
    style   : 'border-top: none;',
    frame   : true,
    animate : true,
    hidden  : true,
    /**
     * @cfg {Number} animDuration
     * Animation duration <strong>in  seconds</strong>.  1 = one second, .5 = 1/2 second.
     */
    animDuration : 250,
    offsetHeight : 20,
    offsetWidth  : 12,

    /**
     * @public
     * @param {Boolean} skipAnim true to skip animation
     */

    // private
    initComponent : function() {
        var me = this;
        delete me.renderTo;
        me.origHeight = me.height;
        me.callParent();
        me.on({
            scope      : me,
			beforeshow : me.onBeforeShow,
			beforehide : me.onBeforeHide
		});
    },

    // private
    init : function(parent) {
        var me = this;
        me.parent = parent;


        // Attach the me as the parent
        parent.blind = me;
        parent.on({
            scope       : me,
            afterrender : me.onParentAfterRender,
            destroy     : me.destroy,
            resize      : me.onWinResize,
            showblind   : me.onWinShowBlind
        });
    },

    onWinShowBlind : function() {
        this.show();
    },
    show : function(skipAnim) {
        var me = this,
            parentHeader = me.parent.header;


        // <debug>
        if (! parentHeader || parentHeader.dock !== 'top') {
            Ext.Error.raise('A top-docked header must be available for me to attach to!');
            return;
        }
        //</debug>

        me.callParent();
        me.el.hide();
        Ext.Function.defer(function() {
            me.el.slideIn('t', {
                scope    : me,
                easing   : 'easeOut',
                duration : me.animDuration,
                callback : function() {
                    me.doLayout();
                }
            });
        });
    },
    /**
     * Hide the Blind.
     * @public
     * @param {Boolean} skipAnim Set true to skip animation
     */
    hide : function(skipAnim) {
        var me = this;
        if (me.hidden) {
            return;
        }

        if (me.animate === true && !skipAnim) {

            me.el.slideOut('t', {
                duration : me.animDuration,
                callback : me.onAfterAnimHide,
                scope    : this
            });
        } else {
            me.callParent();
        }

        // REQUIRED!!!
        me.hidden = true;
    },


	//private
	onBeforeHide : function() {
		if (this.animate) {
			this.getEl().addClass('x-panel-animated');
		}

	},
    /**
     * @private
     *
     */
	onAfterAnimHide : function() {
        var me       = this,
            thisParent  = me.parent,
            toolbars = Ext.ComponentQuery.query('toolbar', thisParent);

        me.el.setVisible(false);
        thisParent.body.unmask();


        Ext.each(toolbars, function(tb) {
            tb.el.unmask();
        });

        me.fireEvent('hide', me);

        if (thisParent.resizer) {
            thisParent.resizer.enable();
        }
    },

    // private
    onBeforeShow : function() {

        var me         = this,
            thisParent = me.parent,
            toolbars   = Ext.ComponentQuery.query('toolbar', thisParent);

        thisParent.body.mask();
        thisParent.body.down('.x-mask').setStyle({
            'background': 'none'
        });

        Ext.each(toolbars, function(tb) {
            tb.el.mask();
            tb.el.down('.x-mask').setStyle({
                'background': 'none'
            });
        });

        if (! me.rendered) {
            me.render(me.renderTo);
            delete me.renderTo;
        }
        
        if (thisParent.resizer) {
            thisParent.resizer.disable();
        }
    },

    //private
    onParentAfterRender : function(parent) {
        var me                   = this,
            hdrSelector          = '.x-window-header', // default to window
            parentClassName      = parent.$className,
            parentEl             = parent.el,
            isParentPanel        = parentClassName == 'Ext.panel.Panel',
            isParentWindow       = parentClassName == 'Ext.window.Window',
            isParentContainer    = parentClassName == 'Ext.container.Container',
            parentTitleBarHeight = 0,
            newParentHeight,
            potentialHeight;

        if (isParentPanel) {
            hdrSelector = '.x-panel-header';
        }

        if (isParentContainer) {
            me.offsetHeight = 0;
        }
        else {
            parentTitleBarHeight = parentEl.child(hdrSelector).getHeight();

            if (isParentWindow) {
                newParentHeight = parentTitleBarHeight + 20;
            }
            else if (isParentPanel) {
                newParentHeight = parentTitleBarHeight + 16;
            }

        }

        me.parentTitleBarHeight = parentTitleBarHeight;

        potentialHeight = parent.body.getHeight() + (parentTitleBarHeight - me.offsetHeight);

        me.renderTo = parentEl;
        me.style    = (me.style || '') + 'z-index: 101;position:absolute;top: '
            + newParentHeight +'px; left: 10px;';
        this.onWinResize(me.parent);
    },
    // private
    onWinResize : function(parent) {
        var me              = this,
            parentEl        = parent.el,
            parentBody      = parent.body,
            origHeight      = me.origHeight,
            potentialHeight = parentEl.getHeight() - (me.parentTitleBarHeight  + me.offsetHeight),
            newWidth        = parentBody.getWidth() - me.offsetWidth,
            amITaller       = (origHeight > potentialHeight),
            newHeight       = amITaller ? potentialHeight : origHeight;

        me.setSize(newWidth,newHeight);
        me.doLayout();
    }
});
