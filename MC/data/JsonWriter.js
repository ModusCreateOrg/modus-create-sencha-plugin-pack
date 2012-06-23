/**
 * An overridden JsonWriter implementation that allows the Model to define how data should be written.
 *
 * If the Model being written has 'writeStructuredData' set to true, it will allow the Model to determine the data
 * format being sent during create and update operations. MC.data.Model provides a default implementation but
 * any Model can then override this behavior to handle any non-standard boundary conditions where necessary.
 */
Ext.define('MC.data.JsonWriter', {
    extend: 'Ext.data.writer.Json',
    alias: 'writer.json',

    getRecordData: function(record, operation) {
        if (record.writeStructuredData) {
            return record.getWriteData();
        } else {
            return this.callParent(arguments);
        }
    }
});