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
                    enabled: true,
                    color: 'white', //(Highcharts.theme && Highcharts.theme.dataLabelsColor)
                    style: {
                        textShadow: '0 0 3px black'
                    }
                }
            }
        }
    },
    calculatorType: 'BarCalculator'
});
