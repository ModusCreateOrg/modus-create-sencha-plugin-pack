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
Ext.ux.TDGi.iconMgr = function(iconName) {
	var iconBase = 'TDGi.iconMgr';
	
	var ruleBodyTpl  = ' \n\r .{0} {  background-image: url({1}) !important; }';
			
	this.styleSheetNum = document.styleSheets.length;
	var styleSheetId = 'TDGi_iconMgr_' + Ext.id();
	var styleSheet = Ext.get(Ext.util.CSS.createStyleSheet('/* TDG-i.iconMgr stylesheet */\n', styleSheetId));
	
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
			}
		]
	});
	
	return  {
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

		}
	}
}();



/*
	IMPORANT!!!
	
	Be sure to change iconBase if you change the directory name

*/
Ext.ux.TDGi.iconBrowser = function() {
	var win;
	var view;
	var imgsFile;
	var iconBase   = 'TDGi.iconMgr';
	var iconsFile  = iconBase + '/icons.js';
	var iconLoc    = iconBase + '/icons';
	var imgExt     = (Ext.isIE6) ? '.gif' : '.png';
	var imgIdSeed  = Ext.id();
	return  {
		init : function() {
			if (! win) {
				
				var store = new Ext.data.SimpleStore({
					url       : iconsFile,
					autoLoad  : true,
					id        : 'name',
					fields    : [ 'icon' ],
					listeners : {
						load : function() {
							win.body.unmask();
						}
					}
				});
				view = 	new Ext.DataView({
					itemSelector : 'div.iconwrap',
					style        : 'overflow:auto',
					multiSelect  : false,
					store        : store,
					border       : true,
					trackOver    : true,
					overClass    : 'x-grid3-row-alt',
					tpl          : new Ext.XTemplate(
						'<tpl for=".">',
							'<div class="iconwrap" style="float: left;padding: 4px 4px 0px 4px;" id="' + Ext.idSeed +  '_{icon}">',
								'<div style=""><img src="' + iconLoc + '/{icon}' + imgExt +'" class="thumb-img"></div>',
							'</div>',
						'</tpl>'
					),
					listeners     : {
						mouseenter : function(view, index, element, evtObj) {
							Ext.fly(win.topToolbar.items.items[2].el).update('' + store.getAt(index).data.icon);
						},
						mouseleave : function(view, index, element, evtObj) {
							Ext.fly(win.topToolbar.items.items[2].el).update('&nbsp;');
						}
						
					}
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
		}
	}
}();
