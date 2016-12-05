describe('CustomChartApp', function() {

    var app, query;

    function renderChart(config) {
        app = Rally.test.Harness.launchApp('CustomChartApp', Ext.merge({
            settings: {
                chartType: 'piechart'
            }
        }, config));
        return once(function() { return app.down('rallychart').componentReady; })
          .then(function() {
              return app.down('rallychart');
          });
    }

    beforeEach(function() {
        Rally.test.Mock.ajax.whenQuerying('Users').respondWith([]);
        Rally.test.Mock.ajax.whenQueryingAllowedValues('Defect', 'ScheduleState')
            .respondWith(["Defined", "In-Progress", "Completed", "Accepted"]);
        var defects = Rally.test.Mock.dataFactory.getData('defect', { count: 10 });
        query = Rally.test.Mock.ajax.whenQuerying('artifact').respondWith(defects);
    });

    describe('configuration', function() {
        pit('should render a pie chart', function() {
            return renderChart({ settings: { chartType: 'piechart' } }).then(function(chart) {
                expect(chart.is('piechart')).toBe(true);
            });
        });

        pit('should render a bar chart', function() {
            return renderChart({ settings: { chartType: 'barchart' } }).then(function(chart) {
                expect(chart.is('barchart')).toBe(true);
            });
        });

        pit('should render a column chart', function() {
            return renderChart({ settings: { chartType: 'columnchart' } }).then(function(chart) {
                expect(chart.is('columnchart')).toBe(true);
            });
        });

        pit('should configure the calculator', function() {
            return renderChart({ settings: {
              aggregationField: 'Priority',
              aggregationType: 'estimate'
            } }).then(function(chart) {
                expect(chart.calculator.field).toBe('Priority');
                expect(chart.calculator.calculationType).toBe('estimate');
            });
        });
    });

    describe('data querying', function() {

        pit('should query the right type', function() {
            return renderChart({ settings: { types: 'defect' } }).then(function(chart) {
                expect(app.down('rallygridboard').modelNames).toEqual(['defect']);
                expect(app.down('rallygridboard').chartConfig.storeConfig.models).toEqual(['defect']);
            });
        });

        pit('should include a query if specified', function() {
            return renderChart({ settings: { query: '(Severity = "Major Problem")' } }).then(function(chart) {
                var filters = app.down('rallygridboard').storeConfig.filters;
                expect(filters.length).toBe(1);
                expect(filters[0].toString()).toBe('(Severity = "Major Problem")');
            });
        });

        pit('should include a timeboxscope if available', function() {
            var iteration = Rally.test.Mock.dataFactory.getRecord('iteration');
            var timeboxScope = Ext.create('Rally.app.TimeboxScope', { record: iteration });
            var appContext = Rally.test.Harness.getAppContext({
                timebox: timeboxScope
            });
            return renderChart({ context: appContext, settings: { query: '(Severity = "Major Problem")' } }).then(function(chart) {
                var filters = app.down('rallygridboard').storeConfig.filters;
                expect(filters.length).toBe(2);
                expect(filters[0].toString()).toBe('(Severity = "Major Problem")');
                expect(filters[1].toString()).toBe(timeboxScope.getQueryFilter().toString());
            });
        });

        pit('should fetch the right fields', function() {
            return renderChart({ settings: { aggregationField: 'Priority' } }).then(function(chart) {
                expect(app.down('rallygridboard').chartConfig.storeConfig.fetch).toEqual(['FormattedID', 'Name', 'Priority']);
            });
        });

        pit('should order by the aggregation field', function() {
            return renderChart({ settings: { aggregationField: 'Priority' } }).then(function(chart) {
                var sorters = app.down('rallygridboard').chartConfig.storeConfig.sorters;
                expect(sorters.length).toBe(1);
                expect(sorters[0]).toEqual({ property: 'Priority', direction: 'ASC' });
            });
        });

        pit('should pass the right context', function() {
            return renderChart().then(function(chart) {
                expect(app.down('rallygridboard').context).toBe(app.getContext());
                expect(app.down('rallygridboard').chartConfig.storeConfig.context).toEqual(app.getContext().getDataContext());
            });
        });

        pit('should load all the data', function() {
            return renderChart().then(function(chart) {
                expect(app.down('rallygridboard').chartConfig.storeConfig.limit).toBe(Infinity);
            });
        });
    });
});
