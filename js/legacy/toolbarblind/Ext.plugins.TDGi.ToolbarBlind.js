Ext.ns("Ext.plugins.TDGi");

(function() {

    var plugin = Ext.extend(Object, {
        init : function(p) {
            if (!p) {
                return false;
            }

            this.parent = p;
            Ext.apply(p, this.parentOverrides);

            p.on({
                scope  : this,
                single : true,
                render : this.onParentRender
            });

        },
        parentOverrides : {

        },
        onDestroy : function() {

        }
    });

    Ext.plugins.TDGi.ToolbarBlind = plugin;
    Ext.preg('toolbarblind', plugin);

})();