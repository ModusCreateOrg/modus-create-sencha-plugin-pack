/**
 * This is an Abstract Class that will provide a single field for
 * associations that appears as a DataView with icons for create,
 * update, and destroy functionality that display a popup form.
 *
 * Required configs are formWindow, itemSelector, name and tpl.
 *
 * It is expected that you use divs with add-icon, edit-icon and 
 * delete-icon classes in your tpl and that edit-icon and 
 * delete-icon exist within each item node and a single add-icon 
 * div exists outside of the item nodes.
 */
Ext.define('MC.form.field.PopupEditorDataViewField', {
    extend: 'MC.form.field.DataViewField',
	
    addIconCls: 'add-icon',
    editIconCls: 'edit-icon',
    deleteIconCls: 'delete-icon',

    /**
     * Required @cfg - should be a class extending from MC.form.Panel
     */
    formWindow: null,

    /**
     * @property - will reference the instance if it is visible
     */
    formWindowInstance: null,

    initComponent: function() {
        this.callParent();
        this.on('itemclick', this.onRowClick, this);
    },

    destroy: function() {
        if (this.formWindow) {
            this.killForm();
        }
        this.callParent(arguments);
    },

    onRender: function() {
        this.callParent(arguments);

        this.el.on({
            click: this.onAddClick,
            scope: this,
            delegate: 'div.add-icon'
        });
    },

    onRowClick: function(view, record, item, index, e) {
        var targetCls = e.getTarget().className;
        if (targetCls === this.editIconCls) {
            this.onEditClick(view, record);
        } else if (targetCls === this.deleteIconCls) {
            this.onDeleteClick(view, record);
        }
    },

    onAddClick: function() {
        this.formWindowInstance = Ext.create(this.formWindow, {
            addMode: true,
            listeners: {
                submit: this.onAddComplete,
                cancel: this.onFormCancel,
                scope: this
            }
        });
        this.formWindowInstance.show();
    },

    onEditClick: function(view, model) {
        model.beginEdit();
        this.formWindowInstance = Ext.create(this.formWindow, {
            addMode: false,
            model: model,
            listeners: {
                submit: this.onEditComplete,
                cancel: this.onFormCancel,
                scope: this
            }
        });
        this.formWindowInstance.show();
    },

    onDeleteClick: function(view, model) {
        this.store.remove(model);
        this.refresh();
    },

    onFormCancel: function() {
        this.killForm();
    },

    onAddComplete: function(form, model) {
        this.store.add(model);
        this.killForm();
        this.refresh();
    },

    onEditComplete: function(form, model) {
        model.endEdit();
        this.killForm();
    },

    killForm: function() {
        this.formWindowInstance.destroy();
        this.formWindowInstance = null;
    }
});