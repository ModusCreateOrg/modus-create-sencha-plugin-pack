Ext.onReady(function(){
	var tabs = new Ext.TabPanel({
        renderTo		: 'tabs1',
		id				: 'myTabs',
		text			: 'yoyo',
        width			: 600,
		tabPanelToolbar : ['->',{ text:'Save' },'->',{ text:'Edit' }],
		height			: 300,
        activeTab		: 0,
        frame			: false,
		enableTabScroll	: true,
        defaults		: {autoHeight: true},
        items			:[
			{contentEl:'script', title: 'Tab Number 1'},
			{contentEl:'markup', title: 'Tab Number 2'},
			{contentEl:'script2', title: 'Tab Number 3'},
			{contentEl:'script3', title: 'Tab Number 4'},
			{contentEl:'script4', title: 'Tab Number 5'},
			{contentEl:'script5', title: 'Tab Number 6'},
			{contentEl:'script6', title: 'Tab Number 7'}
        ]
    });
	
});