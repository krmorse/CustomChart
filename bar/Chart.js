Ext.define('BarChart', {
    xtype: 'barchart',
    extend: 'Rally.ui.chart.Chart',
    requires: [
        'BarCalculator'
    ],

    chartConfig: {
        chart: { type: 'bar' },
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
        legend: false,
        plotOptions: {
            bar: {
                stacking: 'normal',
                dataLabels: {
                    enabled: false
                },
                showInLegend: false,
                colorByPoint: true
            }
        }
    },
    calculatorType: 'BarCalculator'
});
