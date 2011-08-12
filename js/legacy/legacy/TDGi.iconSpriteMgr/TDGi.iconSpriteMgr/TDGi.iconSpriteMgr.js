/*
    Author       : Jay Garcia
    Site         : http://tdg-i.com
    Contact Info : jgarcia@tdg-i.com
    Purpose      : CSS set using the famfamfam silk icon set.
    Icon Sources : http://www.famfamfam.com/lab/icons/silk/
                 : 
    Warranty     : none
    Price        : free

*/

Ext.ns('Ext.ux', 'Ext.ux.TDGi');

/**
 * Ext.ux.TDGi.iconSpriteMgr
 * @Singleton :
 */
Ext.ux.TDGi.iconSpriteMgr = function() {
    var iconBase = 'TDGi.iconSpriteMgr';
    
    var ruleBodyTpl  = ' \n\r .{0} { background:transparent url('+ iconBase +'/iconSprites.png) no-repeat; background-position: 0px -{1}px !important; }';
            
    this.styleSheetNum = document.styleSheets.length;
    var styleSheetId = 'TDGi_iconSpriteMgr_' + Ext.id();
    var styleSheet = Ext.get(Ext.util.CSS.createStyleSheet('.tdgi-icon-sprite {background:transparent url('+ iconBase +'/iconSprites.png) no-repeat !important;}\n', styleSheetId));


    // Needed
    var iconStore = new Ext.data.JsonStore({
        root     : '',
        fields   : [
            {
                name    : 'name',
                mapping : 'n'
            },
            {
                name    : 'file',
                mapping : 'f'
            },
            {
                name    : 'yCoord',
                mapping : 'y'
            }
        ]
    });
    iconStore.loadData(Ext.ux.TDGi.spriteList);

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
         getIcon : function(icon) {
             var iconRecIndex =  iconStore.find('name', icon);
             var iconRecord   =  iconStore.getAt(iconRecIndex);

             if (!iconRecord) {
                 return '';
            }

            var foundIcon = cssClasses.findBy(function(rec, ind){
                if(rec.data.name == icon.name) {
                     return(ind);
                }
            });

            console.info(iconRecord.data);
            if (foundIcon < 0) {

                var cls         = 'tdgi_icon_' + Ext.id();
                var styleBody   = String.format(ruleBodyTpl, cls, iconRecord.data.yCoord);

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

        }
        /*
        getIcon : function(icon) {
            
            var cls         = 'tdgi_icon_' + Ext.id();
            var iconImgPath = iconBase + '/icons/' + icon + imgExtension;
            var styleBody   = String.format(ruleBodyTpl, cls, iconImgPath);
            
            var foundIcon = cssClasses.findBy(function(rec, ind){ 
                if(rec.data.name == icon) {
                     return(ind);     
                }                                                       
            });
            
            if (foundIcon < 0) {
                cssClasses.add(new Ext.data.Record({
                    name     : icon,
                    cssRule  : cls,
                    styleTxt : styleBody
                }));
                var styleSheet = Ext.get(styleSheetId);
                
                //document.getElementById('TDGi.iconMgr').sheet.s
                if (! Ext.isIE) {                    
                    styleSheet.dom.sheet.insertRule(styleBody, styleSheet.dom.sheet.cssRules.length);
                }
                else {
                    // Per http://www.quirksmode.org/dom/w3c_css.html#properties
                    document.styleSheets[styleSheetId].cssText += styleBody;
                }
                Ext.util.CSS.refreshCache();
                
                return(cls);
            }
            else {
                return(cssClasses.getAt(foundIcon).data.cssRule);
            }

        }*/

    }
}();



