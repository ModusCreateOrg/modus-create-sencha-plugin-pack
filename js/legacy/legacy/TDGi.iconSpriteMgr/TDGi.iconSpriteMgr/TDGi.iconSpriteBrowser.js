/*
    IMPORANT!!!

    Be sure to change iconBase if you change the directory name

*/
Ext.ux.TDGi.iconBrowser = function() {
    var win;
    var view;
    var imgsFile;
    var iconBase   = 'TDGi.iconMgr';
    var iconsFile  = iconBase + '/icons.json.js';
    var iconLoc    = iconBase + '/icons';
    var imgExt     = (Ext.isIE6) ? '.gif' : '.png';
    var imgIdSeed  = Ext.id();




    var iconBase = 'TDGi.iconMgr';

    var ruleBodyTpl  = ' \n\r .{0} {width:16px;height:16px; background-position: 0px -{1}px !important; }';

    this.styleSheetNum = document.styleSheets.length;
    var styleSheetId = 'TDGi_iconMgr_' + Ext.id();
    var styleSheet = Ext.get(Ext.util.CSS.createStyleSheet('.tdgi-icon-sprite {width:16px;height:16px; background:transparent url('+ iconBase +'/iconSprites.png) no-repeat;}\n', styleSheetId));

    var imgExtension = (Ext.isIE6) ? '.gif' : '.png';

    var cssClasses = new Ext.data.JsonStore({
        autoLoad : false,
        fields   : [
            {
                name    : 'name',
                mapping : 'name'
            },
            {
                name    : 'cssRule',
                mapping : 'cssRule'
            },
            {
                name    : 'styleBody',
                mapping : 'styleBody'
            },
            {
                name    : 'styleSheetDOMId',
                mapping : 'styleSheetDOMId'
            }
        ]
    });



    return  {
        init : function() {
            if (! win) {

                var store = new Ext.data.SimpleStore({
                    autoLoad  : true,
                    url       : iconBase + '/icons.json.js',
                    id        : 'name',
                    fields    : [
                        {
                            name    : 'name',
                            mapping : 'n'
                        },
                        {
                            name    : 'yCoordinate',
                            mapping : 'y'
                        }
                    ],
                    listeners : {
                        load : function() {
                            win.body.unmask();
                            Ext.util.CSS.refreshCache();
                        }
                    }
                });

                view =     new Ext.DataView({
                    itemSelector : 'div.iconwrap',
                    style        : 'overflow:auto',
                    multiSelect  : false,
                    store        : store,
                    border       : true,
                    trackOver    : true,
                    overClass    : 'x-grid3-row-alt',
                    tpl          : new Ext.XTemplate(
                        '<tpl for=".">',
                            '<div class="iconwrap" style="float: left;margin: 2px 2px 0px 2px;" id="{name}">',
                                '<div class="tdgi-icon-sprite {class}"></div>',
                            '</div>',
                        '</tpl>'
                    ),
                    listeners     : {
                        mouseenter : function(view, index, element, evtObj) {
                            Ext.fly(win.topToolbar.items.items[2].el).update('' + store.getAt(index).data.name);
                        },
                        mouseleave : function(view, index, element, evtObj) {
                            Ext.fly(win.topToolbar.items.items[2].el).update('&nbsp;');
                        }
                    },
                    prepareData: this.prepareData.createDelegate(this)
                });

                var textField = new Ext.form.TextField({
                    width           : 150,
                    emptyText       : 'Type to filter...',
                    enableKeyEvents : true,
                    listeners       : {
                        keyup : {
                            buffer : 200,
                            fn     : function() {
                                var val = this.getValue();
                                var X = 0;

                                store.filterBy(function(record, id) {
                                    var regex = new RegExp('.*' + val + '.*');
                                    if( record.data.icon.match(regex) != null) {
                                        return(true);
                                    }
                                    else {
                                        return(false);
                                    }
                                });
                            }
                        }
                    }
                });

                win = new Ext.Window({
                    height      : 400,
                    width       : 400,
                    minHeight   : 350,
                    minWidth    : 350,
                    layout      : 'fit',
                    closeAction : 'hide',
                    title       : 'TDG-i icon browser',
                    items       : view,
                    buttons     : [
                        {
                            text    : 'OK',
                            handler : this.hide,
                            scope   : this
                        }
                    ],
                    listeners   : {
                        render : {
                            delay : 50,
                            fn    : function() {
                                win.body.mask('Working...', 'x-mask-loading');
                            }
                        }
                    },
                    tbar       : [
                        textField,
                        '-',
                        ''
                    ]
                });
            }
        },
        hide : function() {
            win.hide();
        },
        show : function() {
            this.init();
            win.show();
        },

        prepareData : function(data){
            data.class = this.getIcon(data);


            return data;
        },

        getIcon : function(icon) {

            var cls         = 'tdgi_icon_' + Ext.id();
            var styleBody   = String.format(ruleBodyTpl, cls, icon.yCoordinate);

            var foundIcon = cssClasses.findBy(function(rec, ind){
                if(rec.data.name == icon.name) {
                     return(ind);
                }
            });
            if (foundIcon < 0) {
                cssClasses.add(new Ext.data.Record({
                    name     : icon,
                    cssRule  : cls,
                    styleTxt : styleBody
                }));
                var sheet = Ext.get(styleSheetId);

                if (! Ext.isIE) {
                    sheet.dom.sheet.insertRule(styleBody, sheet.dom.sheet.cssRules.length);
                }
                else {
                    // Per http://www.quirksmode.org/dom/w3c_css.html#properties
                    document.styleSheets[styleSheetId].cssText += styleBody;
                }

                //console.info(cls);
                return(cls);
            }
            else {
                return(cssClasses.getAt(foundIcon).data.cssRule);
            }

        },
        buildNewSheet : function() {


        }
    }
}();
