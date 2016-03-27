Ext.define('PieCalculator', {
    config: {
        calculationType: undefined,
        field: undefined
    },

    constructor: function(config) {
        this.initConfig(config);
    },

    prepareChartData: function(store) {
        var categories, seriesData, data;
        if(this.calculationType === 'count') {
            data = _.countBy(store.getRange(), function(record) {
                return record.get(this.field);
            }, this);
            categories = _.keys(data);
            seriesData = [];
            _.each(data, function(value, key) {
                seriesData.push([key, value]);
            });
        } else {
            data = _.groupBy(store.getRange(), function(record) {
                return record.get(this.field);
            }, this);
            categories = _.keys(data);
            seriesData = [];
            _.each(data, function(value, key) {
                seriesData.push([key, _.reduce(value, function(total, r) {
                    return total + r.get('PlanEstimate');
                }, 0)]);
            });
        }

        return {
            categories: categories,
            series: [
                {
                    type: 'pie',
                    data: seriesData
                }
            ]
        };
    }
});
