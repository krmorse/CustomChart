Ext.define('ColumnChart', {
    xtype: 'columnchart',
    extend: 'Rally.ui.chart.Chart',
    requires: [
        'ColumnCalculator'
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
                },
                showInLegend: false,
                colorByPoint: true
            }
        }
    },
    calculatorType: 'ColumnCalculator'
});
