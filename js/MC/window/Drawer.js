Ext.define('MC.window.Drawer', {
    extend : 'Ext.window.Window',
    alias  : 'plugin.drawer',
    minWidth : 100,
    /**
     * suggested
     * configs
     */
//    shadow : false,
    closable    : false,
    resizable   : false,
    draggable   : false,
    modal       : false,
    closeAction : 'hide',


    // private
    init : function(parent) {
        var me     = this,
            drawer = me;
        me.win = parent;

        parent.drawers = parent.drawers || {};
        parent.drawers[me.side] = me; // add me WindowDrawer to the parent's drawer collection
        parent.on({
            scope         : me,
            resize        : me.alignAndShow,
            show          : me.alignAndShow,
            beforedestroy : me.onParentBeforeDestroy
        });


        //Todo: get ghosting to work.
        /**
         * Manage the ghosting, but NOT for IE, which is a complete fail.  IE's filter css prevents the child ghost
         * from appearing.
         */
        if (! Ext.isIE) {
//            var drawer =  me;  // help keep the sanity!
            parent.ghost = Ext.Function.createInterceptor(parent.ghost, function() {
                drawer.el.hide();

                if (drawer.el && ! drawer.hidden) {
//                    var winGhost    = this.activeGhost,  // this == parent window
//                        drawerGhost = drawer.ghost();
//
//                    winGhost.appendChild(drawerGhost);
//                    drawerGhost.anchorTo(winGhost.dom, drawer.alignToParams.alignTo, drawer.alignToParams.alignToXY);
//                    drawerGhost.applyStyles('z-index: -1;');
//                    winGhost.applyStyles('overflow: visible;');
                }
            });

            parent.unghost = Ext.Function.createInterceptor(parent.unghost, function() {
                Ext.Function.defer(function() {

                    if (! drawer.hidden) {
                        drawer.setAlignment();
                        drawer.el.show();
                    }
                }, 20);
            });
        }
    },

    // private
    initComponent : function() {
        var me = this;
        me.resizeHandles = me.side; // allow resizing only on 1 side (if resizing is allowed)
        me.alignToParams = {};

        me.on({                                                     
			beforeshow : {
				scope : me,
				fn    : me.onBeforeShow
			},
			beforehide: {
				scope : me,
				fn    : me.onBeforeHide
			}
		});

        if (me.size) {
            if (me.side == 'e' || me.side == 'w') {
                me.width = me.size;
            }
            else {
                me.height = me.size;
            }
        }

        this.callParent();
    },

        /**
     * Show the drawer.
     * @publich
     * @param {Boolean} skipAnim Skip animation
     */
    show : function(skipAnim) {
        var me = this;
        if (me.isAnimating) {
            return;
        }

        if (me.hidden && me.fireEvent("beforeshow", me) !== false) {
            me.hidden = false;
            me.onBeforeShow();
            me.afterShow(!!skipAnim);
        }
    },
    toggle : function() {
        var me = this;
        if (me.hidden) {
            me.show();
        }
        else {
            me.hide();
        }
    },
    // private
    toFront: Ext.emptyFn,
    /**
     * Hide the drawer.
     * @publich
     * @param {Boolean} skipAnim Skip animation
     */
    hide : function(skipAnim) {
        var me = this;

        if (me.hidden || ! me.rendered) {
            return;
        }

        if (me.animate === true && !skipAnim) {
            if (me.el.shadow) {
                me.el.disableShadow();
            }
            me.isAnimating = true;
            me.el.slideOut(me.alignToParams.slideDirection, {
                duration : me.animDuration || .25,
                callback : me.onAfterAnimHide,
                scope    : me
            });
        }
        else {
            this.callParent();
        }

        // REQUIRED!!!
        me.hidden = true;
    },

    // private
    onBeforeResize : function() {
        var me = this;

        if (!me.hidden) {
            me.showAgain = true;
        }
        me.hide(true);
    },

	//private
	onBeforeHide : function() {
        var me = this;
        if (me.isAnimating) {
            return;
        }
		if (me.animate) {
			me.getEl().addCls('x-panel-animated');
		}
	},
    /**
     * @private
     *
     */
	onAfterAnimHide : function() {
        var me = this;
        me.isAnimating = false;
        me.el.setVisible(false);
    },
    onParentBeforeDestroy : function() {
        console.log('beforedestroy')
        this.el.hide();
    },
    // private
    onBeforeShow : function() {
        var me = this;
        if (me.rendered) {
    		me.el.removeCls('x-panel-animated');
            me.setAlignment();
            me.setZIndex();
        }
    },

    // private
    afterShow : function(skipAnim) {
        var me = this;
        if (me.animate && !skipAnim) {
			me.getEl().addCls('x-panel-animated');
            me.isAnimating = true;
            me.el.slideIn(me.alignToParams.slideDirection, {
                scope    : me,
                duration : me.animDuration || .25,
                callback : this.onAfterSlideIn
            });
        }
		else {
            this.el.show();
        }
    },
    onAfterSlideIn : function() {
        var me = this;
        me.isAnimating = false;
        if (me.el.shadow) { // honour WindowDrawer's "shadow" config
            // re-enable shadows after animation
            me.el.enableShadow(true);
        }

    },
    // private
    alignAndShow : function() {

        var me           = this,
            renderTarget = document.body;

        if (! renderTarget) {
            return
        }
        if (! me.rendered) {
            me.render(renderTarget);
        }
        me.setAlignment();

        if (me.showAgain) {
            me.show(true);
        }
        me.showAgain = false;
    },

    // private
    setAlignment:  function() {

        var me = this,
            newParams;

        if (! me.el) {
            return;
        }

        switch(me.side) {
            case 'n' :
                me.setWidth(me.win.el.getWidth() - 10);
                newParams = {
                    alignTo        : 'tl',
                    alignToXY      :  [5, (me.el.getComputedHeight() * -1) + 3],
                    slideDirection : 'b'
                };
                break;

            case 's' :
                me.setWidth(me.win.el.getWidth() - 10);
                newParams = {
                    alignTo        : 'bl',
                    alignToXY      :  [5, (Ext.isIE6)? 0 : -3],
                    slideDirection : 't'
                };
                break;

            case 'e' :
                me.setHeight(me.win.el.getHeight() - 10);
                newParams = {
                    alignTo        : 'tr',
                    alignToXY      :  [-3, 5],
                    slideDirection : 'l'
                };
                break;

            case 'w' :
                me.setHeight(me.win.el.getHeight() - 10);
                newParams = {
                    alignTo        : 'tl',
                    alignToXY      :  [(me.el.getComputedWidth() * -1) + 3, 5],
                    slideDirection : 'r'
                };
                break;
        }
        Ext.apply(me.alignToParams, newParams);

        if (!me.hidden) {
            me.el.alignTo(me.win.el, me.alignToParams.alignTo, me.alignToParams.alignToXY);
        }
        // force doLayout()
        me.doLayout();
    },
    setZIndex : function() {
        return this.callParent([-3]);
    }
});

