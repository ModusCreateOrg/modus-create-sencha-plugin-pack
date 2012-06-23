/**
 *
 * Works in conjunction with MC.data.JsonWriter to provide structured payloads during write operations. It will use
 * the Model's mapping fields to build the payload rather than sending a flattened object. This will provide a solid
 * base that should cover most use cases. Any Model can override this behavior as needed.
 *
 * Additionally this allows for hasMany and hasOne associations to be written in the same operation and using the same
 * structured payload approach. Associations also can now have different names in read and write operations: specify
 * both writeName and name if this behavior is needed.
 *
 * The default behavior of Ext JS is to use each field's persist property to determine whether it should be written.
 * Any fields marked with persist false will be ignored. In create operations, all persistable fields are written and
 * in update operations, only changes are written. We have added support for a forcePersist property to mark fields
 * that should be written on update operations even if they have not changed.
 */
Ext.define('MC.data.Model', {
    extend: 'Ext.data.Model',

    writeStructuredData: true,

    getWriteData: function() {
        var data = this.getRecordWriteData(this),
            associations = this.associations.items,
            association, type, name, associatedStore, associatedRecords, associatedRecord,
            i, len, j, jLen,
            phantom = this.phantom,
            writeAllFields = this.writeAllFields;

        for (i=0, len=associations.length; i<len; i++) {

            association = associations[i];
            type = association.type;
            name = association.name;

            if (type == 'hasMany') {

                associatedStore = this[association.storeName];

                if (associatedStore) {

                    //Only write the association if it's an insert, it's specifically required or there are changes
                    if (phantom || writeAllFields || associatedStore.getModifiedRecords().length > 0) {

                        //we will use this to contain each associated record's data
                        data[name] = [];

                        //if it's loaded, put it into the association data
                        if (associatedStore.getCount() > 0) {
                            associatedRecords = associatedStore.data.items;

                            //now we're finally iterating over the records in the association. Get
                            // all the records so we can process them
                            for (j=0, jLen=associatedRecords.length; j<jLen; j++) {
                                data[name][j] = this.getRecordWriteData(associatedRecords[j]);
                            }
                        }
                    }

                }

            } else if (type == 'hasOne') {
                associatedRecord = this[association.instanceName];
                // If we have a record and it has changed, put it onto our list
                if (associatedRecord !== undefined && associatedRecord.dirty) {
                    data[name] = this.getRecordWriteData(associatedRecord);
                }
            }

        }

        return data;
    },

    getRecordWriteData: function(record) {
        var isPhantom = record.phantom === true,
            writeAllFields = record.writeAllFields || isPhantom,
            fields = record.fields,
            fieldItems = fields.items,
            data = {},
            changes,
            field,
            key,
            f, fLen,
            forcePersist;

        changes = record.getChanges();

        for (f=0, fLen=fieldItems.length; f<fLen; f++) {
            field = fieldItems[f];

            if (field.forcePersist || (field.persist && writeAllFields)) {
                this.setFieldWriteData(data, record, field);
            }
        }

        for (key in changes) {
            if (changes.hasOwnProperty(key)) {
                field = fields.get(key);
                if (field.persist) {
                    this.setFieldWriteData(data, record, field, changes[key]);
                }
            }
        }

        return data;
    },

    setFieldWriteData: function(data, record, field, value) {
        var name = field[this.nameProperty] || field.name,
            path, i, len, curr;

        if (!value) {
            value = record.get(field.name);
        }

        // Skip the id field for phantom records
        if (field.name === record.idProperty && record.phantom) {
            return;
        }

        if (field.mapping) {
            if (field.mapping.indexOf('.')) {
                path = field.mapping.split('.');
                curr = data;
                for (i=0, len=path.length-1; i<len; i++) {
                    if (!curr[path[i]]) {
                        curr[path[i]] = {};
                    }
                    curr = curr[path[i]];
                }
                curr[path[i]] = value;
            }
        } else {
            data[name] = value;
        }
    }
});