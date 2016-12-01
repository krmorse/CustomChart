describe('Calculator', function() {

    describe('with defects', function() {

        var data, store;

        beforeEach(function() {
            var model = Rally.test.Mock.dataFactory.getModel('defect');
            data = Rally.test.Mock.dataFactory.getRecords('defect', {
                count: 4,
                values: [
                    { Priority: 'P1', PlanEstimate: 2, Owner: null, c_KanbanState: '' },
                    { Priority: 'P2', PlanEstimate: 3, Owner: { _refObjectName: 'User1' }, c_KanbanState: 'Building' },
                    { Priority: 'P3', PlanEstimate: 4, Owner: { _refObjectName: 'User2' }, c_KanbanState: 'Testing' },
                    { Priority: 'P4', PlanEstimate: 5, Owner: { _refObjectName: 'User3' }, c_KanbanState: 'Done' }
                ]
            });
            store = Ext.create('Rally.data.wsapi.Store', {
              model: model,
              data: data
            });
        });

        it('should aggregate by count', function() {
            var calculator = Ext.create('Calculator', {
                field: 'Priority',
                calculationType: 'count'
            });
            var chartData = calculator.prepareChartData(store);
            expect(chartData.categories).toEqual(['P1', 'P2', 'P3', 'P4']);
            expect(chartData.series.length).toBe(1);
            var seriesData = chartData.series[0];
            expect(seriesData.name).toBe('Priority');
            expect(seriesData.data).toEqual([['P1', 1], ['P2', 1], ['P3', 1], ['P4', 1]]);
        });

        it('should aggregate by plan estimate', function() {
            var calculator = Ext.create('Calculator', {
                field: 'Priority',
                calculationType: 'estimate'
            });
            var chartData = calculator.prepareChartData(store);
            expect(chartData.categories).toEqual(['P1', 'P2', 'P3', 'P4']);
            expect(chartData.series.length).toBe(1);
            var seriesData = chartData.series[0];
            expect(seriesData.name).toBe('Priority');
            expect(seriesData.data).toEqual([['P1', 2], ['P2', 3], ['P3', 4], ['P4', 5]]);
        });

        it('should bucket by object type', function() {
            var calculator = Ext.create('Calculator', {
                field: 'Owner',
                calculationType: 'count'
            });
            var chartData = calculator.prepareChartData(store);
            expect(chartData.categories).toEqual(['-- No Owner --', 'User1', 'User2', 'User3']);
        });

        it('should bucket by custom field type', function() {
            var calculator = Ext.create('Calculator', {
                field: 'c_KanbanState',
                calculationType: 'estimate'
            });
            var chartData = calculator.prepareChartData(store);
            expect(chartData.categories).toEqual(['-- No Entry --', 'Building', 'Testing', 'Done']);
        });
    });

    //TODO: Test pi/feature bucketing
});
