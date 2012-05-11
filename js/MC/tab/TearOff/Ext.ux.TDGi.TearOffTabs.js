Ext.ns("Ext.ux.TDGi");


Ext.ux.TDGi.TearOffTabs = Ext.extend(Object, {
    init : function(parent) {
        if (! parent) {
            return;
        }

        this.ddGroup = parent.ddGroup || 'TDGi-TearOffTabsDDGroup';
        this.parent = parent;

        parent.on({
            scope   : this,
            destroy : this.onParentDestroy,
            render  : this.onParentAfterRender
        });
    },
    onParentAfterRender : function() {
        this.initDD()

    },
    initDD : function() {
        // Setup the people to be draggable
        var stripEls = this.parent.strip.select('li'),
            tabPanel = this.parent;

        /**
         * Drag zone overrides
         */
       var dragZoneOverrides = {
           containerScroll : true,
           scroll          : false,
           ddGroup         : this.ddGroup,
           tabPanel        : this.parent,
           getDragData     : function(evtObj){
               var sourceEl = evtObj.getTarget('li', 10),
                   ddElRaw  = document.createElement('div'),
                   ddElExt  = Ext.get(ddElRaw),
                   repairXY = Ext.get(sourceEl).down('.x-tab-right').getXY();


               ddElRaw.appendChild(sourceEl.cloneNode(true));
               ddElExt = Ext.get(ddElRaw);
               ddElExt.addClass('tdgi-tearofftabs-psuedo-tabstrip-bg');
               ddElExt.setOpacity(.90);

               repairXY[0] +=4;// hack to massage the repair.  Needs a better solution!

               var cmpIds    = sourceEl.id.split('__'),
                   tab      = tabPanel.getComponent(cmpIds[1]),
                   tabIndex = tabPanel.items.indexOf(tab);


               // return dragdata to be used onContainerDrop for the dropZone
               return {
                   ddel     : ddElRaw,
                   repairXY : repairXY,
                   tabPanel : tabPanel,
                   tab      : tab,
                   tabIndex : tabIndex
               };

           },
           getRepairXY: function() {
               return this.dragData.repairXY;
           }
       };



       new Ext.ux.TDGi.TearOffTabs.DragZone(this.parent.strip, dragZoneOverrides);


            /***
             * Drop zone dcode
             */
        var dropZoneOverrides = {
            ddGroup         : this.ddGroup,
            onContainerOver : function() {
              return this.dropAllowed;
            },
            onContainerDrop : function(dropZone, evtObj, dragData) {
                var tabPanel = dragData.tabPanel,
                    tab      = dragData.tab,
                    tabSize  = tab.el.getSize(),
                    diffWidth = tabSize.width * .90,
                    diffHeight = tabSize.height * .90;

                tab.el.setSize(diffWidth,diffHeight);

//                    tab.originalTitle = tab.title;
                tabPanel.remove(tab, false);
                delete tab.width;
                delete tab.height;

                new Ext.Window({
                    border      : false,
                    width       : diffWidth,
                    height      : diffHeight,
                    layout      : 'fit',
                    title       : tab.title,
                    maximizable : true,
                    items       : tab,
                    closable    : false,
                    tools       : [
                        {
                            id      : 'up',
                            qtip    : 'Pop back into Tab Panel',
                            handler : function(evtObj,toolEl,window) {
                                var child = window.items.items[0];
                                window.remove(child, false);
                                tabPanel.insert(dragData.tabIndex, child);
                                tabPanel.doLayout();
                                tabPanel.setActiveTab(child);
                                window.destroy();
                            }
                        }
                    ]
                }).show();

                return true;
            }
        };


        var onStaffDVDropZone = new Ext.dd.DropZone(this.parent.body, dropZoneOverrides);

    },
    onParentDestroy : function(parent) {

    }
});


Ext.ux.TDGi.TearOffTabs.DragZone = Ext.extend(Ext.dd.DragZone, {
    dropAllowed : '',
    dropNotAllowed : '',
    constructor : function(el, config) {
        this.proxy = new Ext.ux.TDGi.TearOffTabs.StatusProxy();
        Ext.ux.TDGi.TearOffTabs.DragZone.superclass.constructor.apply(this, arguments);
    }
});

Ext.ux.TDGi.TearOffTabs.StatusProxy = Ext.extend(Ext.dd.StatusProxy, {
    constructor : function(config){
        Ext.apply(this, config);
        this.id = this.id || Ext.id();
        this.el = new Ext.Layer({
            dh: {
                id: this.id,
                tag: "div",
                cls: "x-dd-drag-proxy "+this.dropNotAllowed,
                children: [
                    {
                        tag: "div",
                        cls: ".tdgi-tearofftabs-psuedo-tabstrip-bg"
                    }
                ]
            },
            shadow: !config || config.shadow !== false
        });
        this.ghost = Ext.get(this.el.dom.childNodes[0]);
        this.dropStatus = this.dropNotAllowed;
    }


});