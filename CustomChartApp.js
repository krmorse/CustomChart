Ext.define('CustomChartApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    layout: 'fit',

    config: {
        defaultSettings: {
            types: 'defect',
            chartType: 'piechart',
            aggregationField: 'State',
            aggregationType: 'count'
        }
    },

    launch: function() {
        Rally.data.wsapi.ModelFactory.getModels({
            types: this._getTypesSetting()
        }).then({
            success: this._onModelsLoaded,
            scope: this
        });
    },

    _onModelsLoaded: function(models) {
        this.models = _.values(models);
        var context = this.getContext(),
            modelNames = _.pluck(this.models, 'typePath'),
            gridBoardConfig = {
                xtype: 'rallygridboard',
                stateful: false,
                toggleState: 'chart',
                chartConfig: this._getChartConfig(),
                plugins: [{
                    ptype:'rallygridboardinlinefiltercontrol',
                    showInChartMode: true,
                    inlineFilterButtonConfig: {
                        stateful: true,
                        stateId: context.getScopedStateId('filters'),
                        filterChildren: true,
                        modelNames: modelNames,
                        inlineFilterPanelConfig: {
                            quickFilterPanelConfig: {
                                defaultFields: [
                                    'ScheduleState',
                                    'Owner',
                                    'ModelType'
                                ]
                            }
                        }
                    }
                },
                {
                    ptype: 'rallygridboardactionsmenu',
                    menuItems: [{
                        text: 'Export to CSV...',
                        handler: function() {
                            window.location = Rally.ui.gridboard.Export.buildCsvExportUrl(this.down('rallygridboard').getGridOrBoard());
                        },
                        scope: this
                    }],
                    buttonConfig: {
                        iconCls: 'icon-export',
                        toolTipConfig: {
                            html: 'Export',
                            anchor: 'top',
                            hideDelay: 0
                        }
                    }
                }],
                context: context,
                modelNames: modelNames,
                storeConfig: {
                    filters: this._getFilters()
                }
            };

        this.add(gridBoardConfig);
    },

    _getTypesSetting: function() {
        return this.getSetting('types').split(',');
    },

    _getChartConfig: function() {
        return {
            xtype: this.getSetting('chartType'),
            chartColors: ['red', 'blue', 'green', 'yellow'],
            storeType: 'Rally.data.wsapi.artifact.Store',
            storeConfig: {
                models: this._getTypesSetting(),
                context: this.getContext().getDataContext(),
                limit: Infinity,
                fetch: ['FormattedID', 'Name', 'PlanEstimate', 'Priority', 'State']
            },
            calculatorConfig: {
                calculationType: this.getSetting('aggregationType'),
                field: this.getSetting('aggregationField')
            }
        };
    },

    onTimeboxScopeChange: function(timeboxScope) {
        this.callParent(arguments);
        this._addBoard();
    },

    _getFilters: function() {
        var queries = [],
            timeboxScope = this.getContext().getTimeboxScope();
        if (this.getSetting('query')) {
            queries.push(Rally.data.QueryFilter.fromQueryString(this.getSetting('query')));
        }
        if (timeboxScope && _.any(this.models, timeboxScope.isApplicable, timeboxScope)) {
            queries.push(timeboxScope.getQueryFilter());
        }
        return queries;
    }
});
