Ext.ns("Ext.plugins", "Ext");


Ext.plugins.AnimatedCloser = Ext.extend(Object, {

    /**
     *
     * @param closeToolIndex Int Where you'd like to place the close tool among existing tools
     */
//    animDirection : 't',
    /**
     *
     * @param fadeOut String The animation method to call
     */
    animType  : 'fadeOut',
    /**
     *
     * @param animCfg Object Configuration object to pass to the animation method call
     */
    animCfg  : {},
    /**
     *
     * @param useGhost Boolean True to use a ghost for faster performance.
     */
    useGhost : true,
    /**
     * constructor
     * @param config
     */
    constructor : function(config) {
        config = config || {};
        Ext.apply(this, config);
    },
    init : function(parent) {

        // If this was not meant to be closable, stop
        if (! parent.closable) {
            return;
        }

        this.parent = parent;


        // reconstruct the way the closable tool works
        delete parent.closable;

        var closeTool = {
            id      : 'close',
            handler : this.onCloseTool,
            scope   : this
        }
        
        if (Ext.isArray(parent.tools)) {
            var closeToolIndex = this.closeToolIndex || parent.tools.length;
            parent.tools.splice(closeToolIndex, 0, closeTool)
        }
        else {
            parent.tools=[closeTool];
        }

        parent.on({
            scope   : this,
            destroy : this.destroy
        });

    },
    /**
     * @method doAnimatedClose
     */
    onCloseTool : function() {
        if (! this.animCbCreated) {
            this.manageCallbacks();
        }
        this.doAnimatedClose();
    },
    /**
     * @method onParentClose Handler for the close tool
     */
    manageCallbacks : function() {
        var win = this.parent;

        // Create a callback method for the  animation callback
        // confused yet?
        if (this.animCfg.callback) {
            this.animCfg.callback = this.animCfg.callback.createSequence(function() {
                win[win.closeAction]();
            });
            this.animCbCreated = true;
        }
        else if (! this.animCfg.callback) {
            // Create a callback to  call the window's closeAction manually
            Ext.apply(this.animCfg, {
                scope    : this,
                callback : function() {
                    win[win.closeAction]();
                }
            });
            this.animCbCreated = true;
        }
    },
    doAnimatedClose : function() {

        var animEl, win = this.parent;

        if (this.useGhost) {
            if (! this.ghost) {
                this.ghost = win.createGhost();
            }
            this.   ghost.show();
            this.ghost.alignTo(win.el, 'tl');
            win[win.closeAction]();

            animEl = this.ghost;
        }
        else {
            win.el.disableShadow();

            animEl = win.el;
        }
        if (this.animDirection) {
            animEl[this.animType](this.animDirection || null, this.animCfg);
        }
        else {
            animEl[this.animType](this.animCfg);
        }

    },
    destroy : function() {
        if (this.ghost) {
            this.ghost.remove();
            this.ghost = null;
        }

        this.parent.un('destroy', this.detroy, this);
    }

});

Ext.preg('animWindowCloser', Ext.plugins.AnimatedCloser);

