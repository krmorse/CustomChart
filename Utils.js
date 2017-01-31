Ext.define('Utils', {
    singleton: true,

    getFieldForAggregationType: function(aggregationType) {
        switch(aggregationType) {
            case 'acceptedleafcount':
                return 'AcceptedLeafStoryCount';
            case 'acceptedleafplanest':
                return 'AcceptedLeafStoryPlanEstimateTotal';
            case 'leafcount':
                return 'LeafStoryCount';
            case 'leafplanest':
                return 'LeafStoryPlanEstimateTotal';
            case 'prelimest':
                return 'PreliminaryEstimateValue';
            default:
                return 'PlanEstimate';
        }
    }
});