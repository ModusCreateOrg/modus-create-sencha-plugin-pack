var buildGrid =  function(title) {

    var remoteProxy = new Ext.data.ScriptTagProxy({
       url : 'http://tdgi/dataQuery.php'
    });


    var recordFields = [
      'id','firstname','lastname','street','city','state','zip','country'
    ];

    var remoteJsonStore = new Ext.data.JsonStore({
        proxy         : remoteProxy,
        id            : 'ourRemoteStore',
        root          : 'records',
        autoLoad      : false,
        totalProperty : 'totalCount',
        remoteSort    : true,
        fields        : recordFields
    });

    var columnModel = [
        {
            header    : 'ID',
            dataIndex : 'id',
            sortable  : true,
            width     : 50,
            resizable : false,
            hidden    : true
        },
        {
            header    : 'Last Name',
            dataIndex : 'lastname',
            sortable  : true,
            hideable  : false,
            width     : 75
        },
        {
            header    : 'First Name',
            dataIndex : 'firstname',
            sortable  : true,
            hideable  : false,
            width     : 75
        },
        {
            header    : 'Address',
            dataIndex : 'street',
            sortable  : false,
            id        : 'addressCol'
        },
        {
            header    : 'Country',
            dataIndex : 'country',
            sortable  : true,
            width     : 150
        }
    ];

    var pagingToolbar = {
        xtype       : 'paging',
        store       : remoteJsonStore,
        pageSize    : 50,
        displayInfo : true
    };

    var doMsgBoxAlert = function(thisGrid) {
        var record = thisGrid.selModel.getSelected();

        var firstName = record.get('firstname');
        var lastName  = record.get('lastname');


        var msg = String.format('The record you chose:<br /> {0}, {1}',
            lastName ,  firstName);

        Ext.MessageBox.alert('', msg);
    };

    var doRowDblClick = function(thisGrid)  {
       doMsgBoxAlert(thisGrid);
    };

    var doRowCtxMenu = function(thisGrid, rowIndex, evtObj) {
        thisGrid.selModel.selectRow(rowIndex);
        evtObj.stopEvent();

        if (! thisGrid.rowCtxMenu) {
           thisGrid.rowCtxMenu = new Ext.menu.Menu({
               items : {
                   text    : 'View Record',
                   handler : function() {
                      doMsgBoxAlert(thisGrid);
                   }
               }
           });
        }

        thisGrid.rowCtxMenu.showAt(evtObj.getXY());
    };


    return {
        xtype            : 'grid',
        columns          : columnModel,
        title            : title,
        store            : remoteJsonStore,
        loadMask         : true,
        bbar             : pagingToolbar,
        autoExpandColumn : 'addressCol',
        stripeRows       : true,
        selModel         : new Ext.grid.RowSelectionModel({singleSelect : true}),
        listeners        : {
           rowdblclick    : doRowDblClick,
           rowcontextmenu : doRowCtxMenu,
           destroy        : function(thisGrid) {
               if (thisGrid.rowCtxMenu) {
                   thisGrid.rowCtxMenu.destroy();
               }
           },
           render : function(g) {
                g.store.load({
                   params : {
                       start : 0,
                       limit : 50
                   }
                });
           }
        }
    };
};

var buildDVPanel =  function(title) {
    var employeeStoreProxy = new Ext.data.ScriptTagProxy({
        url : 'http://extjsinaction.com/getEmployees.php'
    });

    var employeeDvStore = {
        xtype    : 'jsonstore',
        root     : 'records',
        storeId  : 'employeeDv',
        proxy    : employeeStoreProxy,
        fields   : [
            { name : "datehired",     mapping : "datehired" },
            { name : "department",    mapping : "department" },
            { name : "email",         mapping : "email" },
            { name : "firstname",     mapping : "firstname" },
            { name : "id",            mapping : "id" },
            { name : "lastname",      mapping : "lastname" },
            { name : "middle",        mapping : "middle" },
            { name : "title",         mapping : "title" }
        ]
    };

    var employeeDvTpl = new Ext.XTemplate(
        '<tpl for=".">',
            '<div class="emplWrap" id="employee_{id}">',
                '<div class="emplName">{lastname}, {firstname} {title}</div>',
                '<div><span class="title">Department:</span> {department}</div>',
                '<div><span class="title">Date Hired:</span> {datehired}</div>',
                '<div><span class="title">Email:</span> <a href="#">{email}</a></div>',
            '</div>',
         '</tpl>'
    );

    var employeeDv = new Ext.DataView({
        tpl           : employeeDvTpl,
        store         : employeeDvStore,
        singleSelect  : true,
        overClass     : 'emplOver',
        selectedClass : 'emplSelected',
        itemSelector  : 'div.emplWrap',
        emptyText     : 'No images to display',
        style         : 'background-color: #FFFFFF;',
        autoScroll    : true,
        listeners     : {
            click : function(thisDv, index) {
                var record = thisDv.store.getAt(index);
                var formPanel = Ext.getCmp('updateform');
                formPanel.selectedRecord = record;
                formPanel.getForm().loadRecord(record);
            }
        }
    });

    var updateForm = {
        frame       : true,
        id          : 'updateform',
        labelWidth  : 70,
        xtype       : 'form',
        defaultType : 'textfield',
        buttonAlign : 'center',
        title       : 'Update Employee Data',
        labelAlign  : 'top',
        defaults    : {
            anchor : "-5"
        },
        items       : [
            {
                name       : 'lastname',
                fieldLabel : 'Last Name'
            },
            {
                name       : 'firstname',
                fieldLabel : 'First Name'
            },
            {
                name       : 'title',
                fieldLabel : 'Title'
            },
            {
                name       : 'department',
                fieldLabel : 'Department',
                disabled   : true
            },
            {
                xtype      : 'datefield',
                name       : 'datehired',
                fieldLabel : 'Date Hired'
            },
            {
                name       : 'email',
                fieldLabel : 'Email'
            }
        ],
        buttons : [
            {
                text    : 'Save',
                handler : function() {
                    var formPanel = Ext.getCmp('updateform');
                    if (formPanel.selectedRecord) {
                        var vals  = formPanel.getForm().getValues();;

                        for (var valName in vals) {
                            formPanel.selectedRecord.set(valName, vals[valName]);
                        }
                        formPanel.selectedRecord.commit();
                    }
                }
            }
        ]
    };

    var listViewStore = new Ext.data.ScriptTagProxy({
        url : "http://extjsinaction.com/getDepartments.php"
    });

    var departmentLvStore = {
        xtype    : 'jsonstore',
        root     : 'records',
        autoLoad : true,
        storeId  : 'departmentDv',
        proxy    : listViewStore,
        fields   : [
            { name : "department",   mapping : "department" },
            { name : "numEmployees", mapping : "numEmployees" }
        ]
    };

    var departmentLV = new Ext.ListView({
        store         : departmentLvStore,
        singleSelect  : true,
        style         : 'background-color: #FFFFFF;',
        columns       : [
            {
                header    : 'Department Name',
                dataIndex : 'department'
            },
            {
                header    : '# Emp',
                dataIndex : 'numEmployees',
                width     : .20
            }
        ],
        listeners : {
            click : function(thisView, index) {
                var record = thisView.store.getAt(index);
                if (record) {
                    Ext.StoreMgr.get('employeeDv').load({
                        params : {
                            department : record.get('department')
                        }
                    });
                    var formPanel = Ext.getCmp('updateform');
                    delete formPanel.selectedRecord;
                    formPanel.getForm().reset();
                }
            }
        }
    });



   return {
        title        : title,
        layout       : 'hbox',
        border       : false,
        layoutConfig : {
            align : 'stretch'
        },
        defaults      : {
            flex : 1
        },
        items         :  [
            {
                title  : 'All Departments',
                frame  : true,
                layout : 'fit',
                items  : departmentLV,
                flex   : null,
                width  : 210
            },
            {
                title  : 'Employees',
                frame  : true,
                layout : 'fit',
                items  : employeeDv,
                flex   : 1
            },
            updateForm
        ]
   };

};

Ext.onReady(function() {




    new Ext.Viewport({
        layout : 'fit',
        items  : {
            xtype     : 'tabpanel',
            activeTab       : 0,
            id              : "tabpanel" , //<--- debugging only
            enableTabScroll : true,
            plugins         : [new Ext.ux.TDGi.TearOffTabs()],
            items     : [
                buildGrid('GridPanel Tab'),
                {
                    title : 'Tab2',
                    html  : 'tab2'
                },
                {
                    title : '<span style="font-color: #F00 !important;">Tab 3</span>',
                    html  : 'tab3'
                },
                buildDVPanel('DataViewPanel Tab'),
                {
                    title : 'Tab4',
                    html  : 'tab4'
                },
                {
                    title : '<span style="font-color: #F00;">Tab 5</span>',
                    html  : 'tab5'
                }

            ]
        }
    })
});