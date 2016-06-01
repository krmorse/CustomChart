Ext.define('BarChart', {
    xtype: 'barchart',
    extend: 'Rally.ui.chart.Chart',
    requires: [
        'BarCalculator'
    ],

    chartConfig: {
        chart: { type: 'column' },
        title: {
            text: ''
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '{point.name}: <b>{point.y}</b>'
        },
        yAxis: {
            min: 0,
            title: {
                text: ''//this.down('radiogroup').getValue().barCalculationType
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: 'gray'
                }
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false
                }
            }
        }
    },
    calculatorType: 'BarCalculator'
});
