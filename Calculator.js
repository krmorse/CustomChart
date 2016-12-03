Ext.define('Calculator', {

    config: {
        calculationType: undefined,
        field: undefined
    },

    constructor: function(config) {
        this.initConfig(config);
    },

    prepareChartData: function(store) {
        var data = _.groupBy(store.getRange(), function(record) {
            return this._getDisplayValueForField(record, this.field);
        }, this),
        categories = _.keys(data),
        seriesData;

        if(this.calculationType === 'count') {
            seriesData = _.map(data, function(value, key) {
              return [key, value.length];
            });
        } else {
            seriesData = _.map(data, function(value, key) {
                var valueTotal = _.reduce(value, function(total, r) {
                    var valueField = this._getValueFieldForCalculationType();
                    return total + r.get(valueField);
                }, 0, this);
                return [key, valueTotal];
            }, this);
        }

        return {
            categories: categories,
            series: [
                {
                    name: this.field,
                    type: this.seriesType,
                    data: seriesData
                }
            ]
        };
    },

    _getDisplayValueForField: function(record, fieldName) {
        var value = record.get(fieldName);
        if (_.isObject(value)) {
            return value._refObjectName;
        } else if (Ext.isEmpty(value)) {
            var field = record.getField(fieldName),
                fieldType = field.getType();
            if (field.attributeDefinition.SchemaType === 'User') {
                return '-- No Owner --';
            } else if (fieldType === 'rating' || fieldType === 'object') {
                return 'None';
            } else {
                return '-- No Entry --';
            }
        } else {
            return value;
        }
    },

    _getValueFieldForCalculationType: function() {
        switch(this.calculationType) {
            case 'acceptedleafcount':
                return 'AcceptedLeafStoryCount';
            case 'acceptedleafplanest':
                return 'AcceptedLeafStoryPlanEstimateTotal';
            case 'leafcount':
                return 'LeafStoryCount';
            case 'leafplanest':
                return 'LeafStoryPlanEstimateTotal';
            case 'prelimest':
                return 'PreliminaryEstimateValue';
            default:
                return 'PlanEstimate';
        }
    }
});
