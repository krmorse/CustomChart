Ext.define('PieChart', {
    xtype: 'piechart',
    extend: 'Rally.ui.chart.Chart',
    requires: [
        'PieCalculator'
    ],

    chartConfig: {
        chart: { type: 'pie' },
        title: {text: ''},
        plotOptions: {
            pie: {}
        }
    },
    calculatorType: 'PieCalculator'
});
