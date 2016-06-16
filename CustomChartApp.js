Ext.define('CustomChartApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    layout: 'fit',

    config: {
        defaultSettings: {
            types: 'defect',
            chartType: 'piechart',
            aggregationField: 'State',
            aggregationType: 'count',
            query: ''
        }
    },

    launch: function() {
        if (!this.getSetting('types')) {
            this.fireEvent('appsettingsneeded'); //todo: does this work?
        } else {
            Rally.data.wsapi.ModelFactory.getModels({
                types: this._getTypesSetting()
            }).then({
                success: this._onModelsLoaded,
                scope: this
            });
        }
    },

    getSettingsFields: function() {
        return [
            {
                name: 'chartType',
                xtype: 'rallycombobox',
                plugins: ['rallyfieldvalidationui'],
                fieldLabel: 'Chart Type',
                displayField: 'name',
                valueField: 'value',
                editable: false,
                allowBlank: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        { name: 'Pie', value: 'piechart' },
                        { name: 'Bar', value: 'barchart' }
                    ]
                })
            },
            {
                name: 'types',
                xtype: 'rallycombobox',
                plugins: ['rallyfieldvalidationui'],
                allowBlank: false,
                editable: false,
                autoSelect: false,
                validateOnChange: false,
                validateOnBlur: false,
                fieldLabel: 'Type', //todo: delete when multiselect enabled
                // multiSelect: true, //todo: need to validate either all artifacts chosen or only one non-artifact
                shouldRespondToScopeChange: true,
                context: this.getContext(),
                // initialValue: ['HierarchicalRequirement'], //todo: not working
                storeConfig: {
                    model: 'TypeDefinition',
                    sorters: [{ property: 'DisplayName' }],
                    fetch: ['DisplayName', 'TypePath'],
                    filters: [{ property: 'UserListable', value: true }],
                    autoLoad: false,
                    remoteSort: false,
                    sortOnLoad: true,
                    remoteFilter: true
                },
                displayField: 'DisplayName',
                valueField: 'TypePath',
                listeners: {
                    change: function (combo) {
                        combo.fireEvent('typeselected', combo.getValue(), combo.context);
                    },
                    ready: function (combo) {
                      combo.fireEvent('typeselected', combo.getValue(), combo.context);
                    }
                },
                bubbleEvents: ['typeselected'],
                readyEvent: 'ready',
                handlesEvents: {
                    projectscopechanged: function (context) {
                        this.refreshWithNewContext(context);
                    }
                }
            },
            {
                name: 'aggregationField', //todo: don't validate on settings load
                xtype: 'rallyfieldcombobox',
                plugins: ['rallyfieldvalidationui'],
                fieldLabel: 'Aggregate By',
                readyEvent: 'ready',
                allowBlank: false,
                validateOnChange: false,
                validateOnBlur: false,
                handlesEvents: {
                    typeselected: function (models, context) {
                        var type = Ext.Array.from(models)[0];
                        if (type) {
                            this.refreshWithNewModelType(type, context); //todo: how to handle multiple models
                        } else {
                            this.store.removeAll();
                            this.reset();
                        }
                    }
                },
                listeners: {
                    ready: function (combo) {
                        combo.store.filterBy(function (record) {
                            var field = record.get('fieldDefinition'),
                                attr = field.attributeDefinition;
                            return attr && !attr.Hidden && attr.AttributeType !== 'COLLECTION' &&
                                !field.isMappedFromArtifact;
                        });
                        var fields = Ext.Array.map(combo.store.getRange(), function (record) {
                            return record.get(combo.getValueField());
                        });

                        if (!Ext.Array.contains(fields, combo.getValue())) {
                            combo.setValue(fields[0]);
                        }
                    }
                }
            },
            {
                name: 'aggregationType',
                xtype: 'rallycombobox',
                plugins: ['rallyfieldvalidationui'],
                fieldLabel: 'Aggregation Type',
                displayField: 'name',
                valueField: 'value',
                editable: false,
                allowBlank: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        { name: 'Count', value: 'count' },
                        { name: 'Plan Estimate', value: 'estimate' }
                    ]
                })
            },
            { type: 'query' }
        ];
    },

    _onModelsLoaded: function(models) {
        this.models = _.values(models);
        var context = this.getContext(),
            modelNames = _.pluck(this.models, 'typePath'),
            gridBoardConfig = {
                xtype: 'rallygridboard',
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
                                defaultFields: this._getQuickFilters()
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

    _getQuickFilters: function() {
        var quickFilters = [],
          types = this._getTypesSetting(),
          type = types[0];
        if (types.length > 1) {
            quickFilters.push('ModelType');
        }

        if (Rally.data.ModelTypes.isArtifact(type)) {
            quickFilters.push('Owner');
            if (Rally.data.ModelTypes.isPortfolioItem(type)) {
                quickFilters.push('State');
            } else {
                quickFilters.push('ScheduleState');
            }
        }

        return quickFilters;
    },

    _getTypesSetting: function() {
        return this.getSetting('types').split(',');
    },

    _getChartConfig: function() {
        return {
            xtype: this.getSetting('chartType'),
            storeType: 'Rally.data.wsapi.artifact.Store', //todo: only if artifact types selected
            chartColors: [
              "#FF8200", // $orange
              "#F6A900", // $gold
              "#FAD200", // $yellow
              "#8DC63F", // $lime
              "#1E7C00", // $green_dk
              "#337EC6", // $blue_link
              "#005EB8", // $blue
              "#7832A5", // $purple,
              "#DA1884",  // $pink,
              "#C0C0C0" // $grey4
            ],
            storeConfig: {
                models: this._getTypesSetting(),
                context: this.getContext().getDataContext(),
                //TODO: can we do summary fetch here and not limit infinity?
                //we'll have to also make sure the fetch is correct for export somehow...
                limit: Infinity,
                fetch: ['FormattedID', 'Name', 'PlanEstimate', this.getSetting('aggregationField')]
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
