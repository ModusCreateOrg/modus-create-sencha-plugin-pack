Ext.define('MC.form.field.DataViewField', {
    extend: 'Ext.view.View',
    xtype: 'dataviewfield',
    mixins: {
        field: 'Ext.form.field.Field'
    },

    initComponent: function() {
        this.callParent();
        this.initField();
        this.on('itemclick', this.onRowClick, this);
    },

    isEqual: function(value1, value2) {
        return (Ext.encode(value1) === Ext.encode(value2));
    },

    bindStore: function(store) {
        var hadStore = false;

        if (this.store) {
            this.store.un('datachanged', this.onStoreChange, this);
            this.store.un('update', this.onStoreChange, this);
            this.store.un('add', this.onStoreChange, this);
            this.store.un('remove', this.onStoreChange, this);
            hadStore = true;
        }
        this.callParent(arguments);

        if (store !== null) {
            this.value = this.calculateValue();
            this.initValue();

            this.store.on('datachanged', this.onStoreChange, this);
            this.store.on('update', this.onStoreChange, this);
            this.store.on('add', this.onStoreChange, this);
            this.store.on('remove', this.onStoreChange, this);

            if (hadStore) {
                this.fireEvent('dirtychange', this, false);
            }
        }
    },

    getName: function() {
        return this.name;
    },

    reset: function() {
        if (this.store) {
            this.store.rejectChanges();
        }
        this.refresh();
    },

    calculateValue: function() {
        var values = [], r, rLen, record, value, c, cLen, fieldName;
        
        for (r=0, rLen=this.store.getCount(); r<rLen; r++) {
            record = this.store.getAt(r);
            value = {};
            for (c=0, cLen=record.fields.getCount(); c<cLen; c++) {
                fieldName = record.fields.getAt(c);
                value[fieldName] = record.get(fieldName);
            }
            values[r] = value;
        }

        return values;
    },

    onStoreChange: function() {
        this.setValue(this.calculateValue());
    }
});