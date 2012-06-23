/**
 * JsonReader extension to allow safe traversal of nested data.
 * 
 * The built-in JSON Reader will fail to read any fields which have mappings, which are not present in the response.
 * For instance, a response of { field1: 'value1' } will throw an exception for field3 (but not field2) for the
 * following fields definition:
 *
 *     fields: [ { name: 'field1' }, { name: 'field2' }, { name: 'field3', mapping: 'some.structure.field3' } ]
 *
 * This reader provides a workaround in cases where this may occur. However, it should only be used as needed because
 * it is more expensive. To enable this for your model, set safeMappings to true in the reader config.
 */
Ext.define('MC.data.JsonReader', {
    extend: 'Ext.data.reader.Json',
    alias: 'reader.json',

    safeMappings: false,

    createFieldAccessExpression: (function() {
        var re = /[\[\.]/;

        return function(field, fieldVarName, dataName) {
            var hasMap = (field.mapping !== null),
                map    = hasMap ? field.mapping : field.name,
                result,
                operatorSearch,
                mapFields, mapResult, i, len, value;

            if (typeof map === 'function') {
                result = fieldVarName + '.mapping(' + dataName + ', this)';
            } else if (this.useSimpleAccessors === true || ((operatorSearch = String(map).search(re)) < 0)) {
                if (!hasMap || isNaN(map)) {
                    // If we don't provide a mapping, we may have a field name that is numeric
                    map = '"' + map + '"';
                }
                result = dataName + "[" + map + "]";
            } else if (this.safeMappings && operatorSearch > 0) {
                mapFields = map.split('.');
                mapResult = [];
                for (i=0, len=mapFields.length-1; i<len; i++) {
                     mapResult[i] = dataName + '.' + mapFields.slice(0, i+1).join('.');
                }
                value = dataName + '.' + mapFields.slice(0, i+1).join('.');
                result = '(' + (mapResult.join(' && ') + ' ? ' + value + ' : ' + 'undefined' ) + ')';
            } else {
                result = dataName + (operatorSearch > 0 ? '.' : '') + map;
            }
            return result;
        };
    }())
});