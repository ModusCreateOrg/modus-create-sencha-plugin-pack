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
                this.bindModel(Ext.create(this.model, {}));
            }

        } else {

            //Bind the provided model to be updated
            this.bindModel(this.model);

        }
    },

    bindModel: function(model) {
        this.model = model;
        this.loadRecord(model);
    },

    commit: function(callback, scope) {
        if (this.form.isDirty()) {
            this.form.updateRecord(this.model);

            this.model.save({
                callback: function(records, operation) {
                    if (operation.wasSuccessful()) {
                        this.onModelSaveSuccess(records, operation);
                    } else {
                        this.onModelSaveFailure(records, operation);
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
        this.bindModel(record);
    },

    onModelLoadFailure: function(record, operation) {
        Ext.Msg.alert('Error', 'Form data could not be loaded.');
    },

    onModelSaveSuccess: function(records, operation) {
        //This will reset the original values of the form so it's no longer dirty
        this.loadRecord(this.model);
        Ext.Msg.alert('Success', 'Form data was successfully saved!.');
    },

    onModelSaveFailure: function(records, operation) {
        Ext.Msg.alert('Error', 'An error occurred saving your changes. Please try again.');
    }

});