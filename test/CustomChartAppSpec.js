describe('CustomChartApp', function() {

    beforeEach(function() {
        Rally.test.Mock.ajax.whenQuerying('Users').respondWith([]);
        Rally.test.Mock.ajax.whenQueryingAllowedValues('Defect', 'ScheduleState')
            .respondWith(["Defined", "In-Progress", "Completed", "Accepted"]);
        Rally.test.Mock.ajax.whenQuerying('defect').respondWith([]);
    });

    pit('should render the app', function() {
        var app = Rally.test.Harness.launchApp('CustomChartApp');
        return once(function() { return app.down('rallychart').componentReady; }).then(function() {
            expect(app.getEl()).toBeDefined();
        });
    });
});
