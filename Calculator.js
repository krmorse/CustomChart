Ext.define('Calculator', {

    config: {
        calculationType: undefined,
        field: undefined,
        /*
         * {Boolean} useNoneForBlank
         * If true, show "None" for categories where the value is "".
         */
        useNoneForBlank: false
    },

    constructor: function(config) {
        this.initConfig(config);
    },

    prepareChartData: function(store) {
        var data = _.groupBy(store.getRange(), function(record) {
            var value = record.get(this.field);
            if ( Ext.isEmpty(value) && this.useNoneForBlank ) {
                value = "None";
            }
            return _.isObject(value) ? value._refObjectName : value;
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

    _getValueFieldForCalculationType: function() {
        switch(this.calculationType) {
            case 'leafplanest':
                return 'LeafStoryPlanEstimateTotal';
            case 'prelimest':
                return 'PreliminaryEstimateValue';
            default:
                return 'PlanEstimate';
        }
    }
});
