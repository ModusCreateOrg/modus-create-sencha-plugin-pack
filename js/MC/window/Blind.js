/*
    Author       : Jay Garcia
    Site         : http://moduscreate.com
    Contact Info : jay@moduscreate.com
    Purpose      : Window Blinds for Ext 4.x Ext.Window class, which emulates OS X behavior.
    Warranty     : none
    License      : MIT,
    Price        : free
    Version      : 1.0
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

    alias     : 'plugin.MC.window.Blind',
    headerSelector : '.x-window-header',
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
    init : function(win) {
        var me = this;
        me.win = win;


        // Attach the me as the win
        win.blind = me;
        win.on({
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
        var me = this;

        var winHeader = me.win.header;
        // <debug>
        if (! winHeader || winHeader.dock !== 'top') {
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
                duration : me.animDuration
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

    // private
    initComponent : function() {
        var me = this;
        delete me.renderTo;

        this.callParent();
        me.on({
            scope      : me,
			beforeshow : me.onBeforeShow,
			beforehide : me.onBeforeHide
		});
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
            thisWin  = me.win,
            toolbars = Ext.ComponentQuery.query('toolbar', thisWin);

        me.el.setVisible(false);
        thisWin.body.unmask();


        Ext.each(toolbars, function(tb) {
            tb.el.unmask();
        });

        me.fireEvent('hide', me)
    },

    // private
    onBeforeShow : function() {

        var me       = this,
            thisWin  = me.win,
            toolbars = Ext.ComponentQuery.query('toolbar', thisWin);

        thisWin.body.mask();
        thisWin.body.down('.x-mask').setStyle({
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
    },

    //private
    onParentAfterRender : function(parent) {
        var me = this,
            hdrSelector       = '.x-window-header', // default to window
            parentClassName   = parent.$className,
            isParentPanel     = parentClassName == 'Ext.panel.Panel',
            isParentWindow    = parentClassName == 'Ext.window.Window',
            isParentContainer = parentClassName == 'Ext.container.Container',
            newParentHeight;

            me.parentTitleBarHeight = 0

        if (isParentPanel) {
            hdrSelector = '.x-panel-header';
        }

        if (isParentContainer) {
            me.offsetHeight = 0;

        }
        else {
            me.parentTitleBarHeight = parent.el.child(hdrSelector).getHeight();

            if (isParentWindow) {
                newParentHeight = me.parentTitleBarHeight + 5;
            }
            else if (isParentPanel) {
                newParentHeight = me.parentTitleBarHeight - 1;
            }

        }




        this.renderTo = parent.el;
        this.style    = (this.style || '') + 'z-index: 101;position:absolute;top: ' + newParentHeight +'px; left: 10px;';
        this.height   = this.height || parent.body.getHeight() + (me.parentTitleBarHeight - me.offsetHeight);
    },
    // private
    onWinResize : function(win) {
        var me = this,
            winBody = win.body,
            newWidth = winBody.getWidth() - me.offsetWidth,
            newHeight = winBody.getHeight() + (me.parentTitleBarHeight - me.offsetHeight);

        me.setSize(newWidth,newHeight);
    }
});
