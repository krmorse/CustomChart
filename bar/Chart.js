Ext.define('BarChart', {
    xtype: 'barchart',
    extend: 'Rally.ui.chart.Chart',
    requires: [
        'BarCalculator'
    ],

    config: {
        chartConfig: {
            chart: { type: 'bar' },
            title: {
                text: ''
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: 'gray'
                    }
                },
                reversedStacks: false
            },
            plotOptions: {
                bar: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true,
                    colorByPoint: false
                }
            }
        },
        calculatorType: 'BarCalculator'
    },

    constructor: function(config) {
        config = config || {};
        this.mergeConfig(config);

        this.chartConfig.plotOptions.bar.showInLegend = this.enableStacking;
        this.chartConfig.plotOptions.bar.colorByPoint = !this.enableStacking;

        if (!this.enableStacking) {
            this.chartConfig.tooltip = {
                headerFormat: '',
                pointFormat: '{point.name}: <b>{point.y}</b>'
            };
        }

        this.callParent([this.config]);
    }
});
