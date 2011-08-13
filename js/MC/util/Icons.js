/*
	Author       : Jay Garcia
	Site         : http://ModusCreate.com
	Contact Info : jgarcia@moduscreate.com
	               @_jdg
	Purpose      : CSS set using the famfamfam silk icon set.
	Icon Sources : http://www.famfamfam.com/lab/icons/silk/
	Warranty     : none
	Price        : free
*/

/**
 * @class MC.util.Icons
 * @extends Object
 * @singleton
 * @constructor // DOCUMENTATION HERE
 */
Ext.define('MC.util.Icons', function() {
	var ruleTpl       = ' \n\r .{0} { background-image: url({1}) !important}',
        imgExtension  = '.png',
        idSeed        = 0,
        cssClassStore,
        styleSheetId,
        sheetDomRef,
        foundIconIndex,
        iconsDir;


	return  {
        singleton : true,
        requires  : [
            'Ext.data.Store',
            'Ext.data.proxy.Memory',
            'Ext.data.proxy.Client',
            'MC.util.IconsModel',
            'Ext.util.Region',
            'Ext.util.Point',
            'Ext.util.CSS',
            'Ext.String'
        ],
        //private
        init : function() {
            this.setIconsDir();
            cssClassStore = Ext.create('Ext.data.Store', {
                model : 'MC.util.IconsModel',
                proxy : {
                    type : 'memory'
                }
            });

            styleSheetId = 'MC_icons_' + Ext.id();
            sheetDomRef  = Ext.util.CSS.createStyleSheet('/* MC_icons_ stylesheet */\n', styleSheetId);
        },

        // figure out where this file was loaded and then set the iconsDir;
        setIconsDir : function() {
            var scriptTags = document.getElementsByTagName('script'),
                scriptRe   = /Icons\.js/,
                i          = 0,
                foundStr,
                scriptPath,
                ln,
                scriptSrc;

            for (ln = scriptTags.length; i < ln; i++) {
                scriptSrc = scriptTags[i].src.split('?')[0];
                foundStr = scriptSrc.match(scriptRe);
                if (foundStr) {
                    scriptPath = scriptSrc.substring(0, scriptSrc.length - foundStr[0].length);
                    break;
                }
            }

            iconsDir = scriptPath + 'icons/';
        },
        /**
         * @method get returns an automated CSS rule
         * @public
         * @param icon {String}
         */
		get : function(icon) {

			foundIconIndex = cssClassStore.findBy(function(rec, ind){
				if(rec.data.name == icon) {
					 return ind;
				}
			});

			if (foundIconIndex < 0) {
                var cls         = 'mci_' + idSeed++,
                    iconImgPath = iconsDir + icon + imgExtension,
                    styleBody   = Ext.String.format(ruleTpl, cls, iconImgPath),
                    newRec      = cssClassStore.model.create({
                        name     : icon,
                        cssRule  : cls,
                        styleTxt : styleBody
                    });

				cssClassStore.add(newRec);

				if (! Ext.isIE) {
					sheetDomRef.insertRule(styleBody, sheetDomRef.cssRules.length);
				}
				else {
					// Per http://www.quirksmode.org/dom/w3c_css.html#properties
					document.styleSheets[styleSheetId].cssText += styleBody;
				}
				Ext.util.CSS.refreshCache();

				return cls;
			}
			else {
				return cssClassStore.getAt(foundIconIndex).data.cssRule;
			}

		}
	}
}(), function() {
    // init AFTER Ext JS has loaded!
    this.init();
});



/*
	IMPORANT!!!
	
	Be sure to change iconBase if you change the directory name

*/
//Ext.ux.TDGi.iconBrowser = function() {
//	var win;
//	var view;
//	var imgsFile;
//	var iconBase   = 'MC_icon';
//	var iconsFile  = iconBase + '/icons.js';
//	var iconLoc    = iconBase + '/icons';
//	var imgExt     = (Ext.isIE6) ? '.gif' : '.png';
//	var imgIdSeed  = Ext.id();
//	return  {
//		init : function() {
//			if (! win) {
//
//				var store = new Ext.data.SimpleStore({
//					url       : iconsFile,
//					autoLoad  : true,
//					id        : 'name',
//					fields    : [ 'icon' ],
//					listeners : {
//						load : function() {
//							win.body.unmask();
//						}
//					}
//				});
//				view = 	new Ext.DataView({
//					itemSelector : 'div.iconwrap',
//					style        : 'overflow:auto',
//					multiSelect  : false,
//					store        : store,
//					border       : true,
//					trackOver    : true,
//					overClass    : 'x-grid3-row-alt',
//					tpl          : new Ext.XTemplate(
//						'<tpl for=".">',
//							'<div class="iconwrap" style="float: left;padding: 4px 4px 0px 4px;" id="' + Ext.idSeed +  '_{icon}">',
//								'<div style=""><img src="' + iconLoc + '/{icon}' + imgExt +'" class="thumb-img"></div>',
//							'</div>',
//						'</tpl>'
//					),
//					listeners     : {
//						mouseenter : function(view, index, element, evtObj) {
//							Ext.fly(win.topToolbar.items.items[2].el).update('' + store.getAt(index).data.icon);
//						},
//						mouseleave : function(view, index, element, evtObj) {
//							Ext.fly(win.topToolbar.items.items[2].el).update('&nbsp;');
//						}
//
//					}
//				});
//
//				var textField = new Ext.form.TextField({
//					width           : 150,
//					emptyText       : 'Type to filter...',
//					enableKeyEvents : true,
//					listeners       : {
//						keyup : {
//							buffer : 200,
//							fn     : function() {
//								var val = this.getValue();
//								var X = 0;
//
//								store.filterBy(function(record, id) {
//									var regex = new RegExp('.*' + val + '.*');
//									if( record.data.icon.match(regex) != null) {
//										return(true);
//									}
//									else {
//										return(false);
//									}
//								});
//							}
//						}
//					}
//				});
//
//				win = new Ext.Window({
//					height      : 400,
//					width       : 400,
//					minHeight   : 350,
//					minWidth    : 350,
//					layout      : 'fit',
//					closeAction : 'hide',
//					title       : 'TDG-i icon browser',
//					items       : view,
//					buttons     : [
//						{
//							text    : 'OK',
//							handler : this.hide,
//							scope   : this
//						}
//					],
//					listeners   : {
//						render : {
//							delay : 50,
//							fn    : function() {
//								win.body.mask('Working...', 'x-mask-loading');
//							}
//						}
//					},
//					tbar       : [
//						textField,
//						'-',
//						''
//					]
//				});
//			}
//		},
//		hide : function() {
//			win.hide();
//		},
//		show : function() {
//			this.init();
//			win.show();
//		}
//	}
//}();
