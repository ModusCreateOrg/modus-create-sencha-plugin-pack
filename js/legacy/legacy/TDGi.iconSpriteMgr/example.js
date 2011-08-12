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
Ext.onReady(function() {
	new Ext.Button({
		text     : 'Click to see IconBrowser (May be slow over the inter-tubes)',
		iconCls  : Ext.ux.TDGi.iconSpriteMgr.getIcon('accept'),
		renderTo : Ext.getBody(),
		handler  : function() {
			Ext.ux.TDGi.iconBrowser.show();
		}
	});
	
	new Ext.TabPanel({
		width      : 500,
		height     : 200,
		activeItem : 0,
		renderTo   : Ext.getBody(),
		items      : [
			{
				iconCls : Ext.ux.TDGi.iconSpriteMgr.getIcon('cross'),
				title   : 'Cross',
				html    : "iconCls : Ext.ux.TDGi.iconMgr.getIconSprite('cross')"
			},

			{
				iconCls : Ext.ux.TDGi.iconSpriteMgr.getIcon('application_osx_link'),
				title   : 'OS X Link',
				html    : "iconCls : Ext.ux.TDGi.iconMgr.getIconSprite('application_osx_link')"
			}				
		]
	});
});



