define(["spec/SpecHelper", "PoziGeolocate"], function(SpecHelper, PoziGeolocate) {

    describe("PoziGeolocate", function() {
        var subject, currentLocationLayer;

        beforeEach(function() {
            currentLocationLayer = jasmine.createSpyObj("currentLocationLayer", ["setLocation"]);
            subject = PoziGeolocate.doNew(currentLocationLayer);
        });

        it("should use high accuracy positioning", function() {
            expect(subject.geolocationOptions.enableHighAccuracy).toBe(true);
        });

        describe("locationfailed handler", function() {

            beforeEach(function() { spyOn(window, "alert"); });

            it("should give feedback if there was a timeout", function() {
                subject.events.triggerEvent("locationfailed", { error: { code: 3 } });
                expect(window.alert.mostRecentCall.args[0]).toMatch(/timed out before retrieving/);
            });

            it("should give feedback if the user denied permission", function() {
                subject.events.triggerEvent("locationfailed", { error: { code: 1 } });
                expect(window.alert.mostRecentCall.args[0]).toMatch(/not allowed to access/);
            });

            it("should give feedback if there was some other error", function() {
                subject.events.triggerEvent("locationfailed", { error: { code: 99, message: "extra message"} });
                expect(window.alert.mostRecentCall.args[0]).toMatch(/error.*: extra message$/);
            });

        });

        describe("locationupdated handler", function() {
            it("should delegate location update to currentLocation layer", function() {
                var point = jasmine.createSpy("point");
                var accuracy = jasmine.createSpy("accuracy");
                subject.events.triggerEvent("locationupdated", { point: point, position: { coords: { accuracy: accuracy } } });
                expect(currentLocationLayer.setLocation).toHaveBeenCalledWith(point, accuracy);
            });
        });

    });

});

