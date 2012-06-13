/**
 * This is a Form Panel that allows for simplified integration with
 * Models. It can be instantiated in one of three ways:
 * 
 * Create empty record
 * Ext.create('MC.form.Panel', { model: 'MC.model.MyModel' });
 *
 * Modify an existing record for which you only have the id
 * Ext.create('MC.form.Panel', { 
 *     model: 'MC.model.MyModel', 
 *     modelId: 1234
 * });
 *
 * Modify a record for which you have an existing model
 * Ext.create('MC.form.Panel', { model: myModelInstance });
 *
 * Invoking myFormPanel.commit() will save the record forcing
 * the data to be written if a proxy (with a writer) is defined 
 * on the Model.
 */
Ext.define('MC.form.Panel', {
    extend: 'Ext.form.Panel',

    /**
     * Can be a reference to a model instance or a model class name.
     */
    model: null,
    /**
     * Set to the id of the model instance and the model will be loaded for you.
     * Only applicable if model provided is a model class name (string).
     */
    modelId: null,

    initComponent: function() {

        this.callParent();

        this.getForm().trackResetOnLoad = true; //Workaround

        if (Ext.isString(this.model)) {

            //Load a model to be updated
            if (this.modelId) {

                Ext.ClassManager.get(this.model).load(this.modelId, {
                    failure: this.onModelLoadFailure,
                    success: this.onModelLoadSuccess,
                    scope: this
                });

            //Load an empty record to be inserted
            } else {
                this.loadRecord(Ext.create(this.model, {}));
            }

        } else {

            //Bind the provided model to be updated
            this.loadRecord(this.model);

        }

        this.addEvents('loadsuccess', 'loadfailure', 'savesuccess', 'savefailure');
    },

    loadRecord: function(model) {
        var i, len, associations = model.associations.items, name, field;
        
        this.callParent(arguments);

        // loadRecord() won't include associated data, so let's do that.
        for (i=0, len=associations.length; i<len; i++) {
            name = associations[i].name;
            field = this.down('[name='+name+']');
            if (field && field.isFormField && field.bindStore) {
                field.bindStore(model[name]());
            }
        }
    },

    commit: function(callback, scope) {
        if (this.form.isDirty()) {
            this.form.updateRecord(this.getRecord());

            this.model.save({
                callback: function(records, operation) {
                    if (operation.wasSuccessful()) {
                        this.fireEvent('savesuccess', this, records, operation);
                    } else {
                        this.fireEvent('savefailure', this, records, operation);
                    }
                    if (callback) {
                        callback.call(scope || this, this, operation.wasSuccessful(), this.model);
                    }
                },
                scope: this
            });
        }
    },

    onModelLoadSuccess: function(record, operation) {
        this.loadRecord(record);
        this.fireEvent('loadsuccess', this, record, operation);
    },

    onModelLoadFailure: function(record, operation) {
        this.fireEvent('loadfailure', this, record, operation);
    }

});