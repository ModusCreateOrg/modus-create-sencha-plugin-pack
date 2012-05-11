
Ext.namespace('Ext.ux.InlineToolbarTabPanel');

Ext.ux.InlineToolbarTabPanel = function(config) {
	this.toolbar = { 
		width : 150,
		id    : this.id + 'Toolbar'
	}
	

	this.on('render', function() {
		console.info('here');
		this.renderToolbar();
	}, this);

	
	
	Ext.ux.InlineToolbarTabPanel.superclass.constructor.call(this, config);
	//this.addEvents('beforerender', 'onrender')

	
};
 
// plugin code
Ext.extend(Ext.ux.InlineToolbarTabPanel, Ext.TabPanel, {
	onRender : function() {
		Ext.ux.InlineToolbarTabPanel.superclass.onRender.call(this);
		this.renderToolbar();
		
	},
	
	getScrollArea : function(){
		var newScrollArea = this.stripWrap.dom.clientWidth-this.config.toolbar.width;
		return parseInt(newScrollArea, 10) || 0;
	},
		
	renderToolbar : function() {
		//this.fireEvent('beforeRender');
		console.info('here');
		var toolbarDiv = this.toolbar.id || this.id + '-toolbar';
		
		Ext.DomHelper.insertFirst(
			Ext.fly(this.id), 
			'<div id="'+toolbarDiv+'" class="x-tab-toolbar-wrap" style="float:right;height:26px;overflow:hidden;border-left:0px;border-top:1px solid #8DB2E3;margin-left:0px;"></div>'
		);
		
		Ext.apply(this.InlineTbCfg, {
			renderTo : toolbarDiv,
			border   : false				  			  
		});
		
		
		
		var toolbarExt = Ext.get(toolbarDiv);
		toolbarExt.setWidth(this.config.toolbar.width || 100);
		
		var headerEl  = Ext.query('#myTabs div[class^=x-tab-panel-header]');
		var headerExt = Ext.get(headerEl);
		
		
		if ( Ext.isIE ) {
			// adjust for scrollbars being present if scrolling
			extraLength = 0;
			if ( this.scrolling ) { extraLength = 35; };
			
			// adjust width for IE
			headerExt.setWidth(this.getScrollArea() + extraLength);
			Ext.DomHelper.insertFirst(
				 document.getElementById(this.id), 
				'<div id="'+toolbarDiv+'IEHack" class="x-toolbar" style="position:absolute;z-index:-2;height:21px;width:100px;border:1px solid #8DB2E3;border-bottom:1px solid #99BBE8;;"> </div>'
			);
			
			newDiv = Ext.get(toolbarDiv + 'IEHack');
			newDiv.setWidth(this.getScrollArea() + (this.config.toolbar.width*.5));
		}
		
		else {
			headerExt.setWidth('auto');	
		}
				
		
		
	},
		
	getToolbar : function() {
		return Ext.get(toolbarDiv);
	}

});