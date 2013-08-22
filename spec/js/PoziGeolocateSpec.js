define(["spec/SpecHelper", "js/PoziGeolocate", "js/proj"], function(SpecHelper, PoziGeolocate, proj) {

    describe("PoziGeolocate", function() {
        var subject,
            currentLocationLayer,
            successHandler,
            failureHandler,
            options,
            oldNavigator;
        var fakeWatchId = jasmine.createSpy("watchId");

        beforeEach(function() {
            currentLocationLayer = jasmine.createSpyObj("currentLocationLayer", ["setLocation", "clearLocationMarker"]);
            spyOn(window, "alert");
            oldNavigator = window.navigator;
            window.navigator = { geolocation: jasmine.createSpyObj("geolocation", ["watchPosition", "clearWatch"]) };
            window.navigator.geolocation.watchPosition.andCallFake(function(s, f, o) {
                successHandler = s;
                failureHandler = f;
                options = o;
                return fakeWatchId; 
            });
            subject = PoziGeolocate.doNew(currentLocationLayer);
            subject.startFollowing();
        });

        afterEach(function() {
            window.navigator = oldNavigator;
        });

        describe("#startFollowing", function() {
            it("should use high accuracy positioning", function() {
                expect(options.enableHighAccuracy).toBe(true);
            });

            it("should delegate location update to currentLocation layer", function() {
                var accuracy = jasmine.createSpy("accuracy");
                var lon = jasmine.createSpy("lon");
                var lat = jasmine.createSpy("lat");
                var point = jasmine.createSpyObj("point", ["transform"]);
                var webMercatorPoint = jasmine.createSpy("webMercatorPoint");
                spyOn(OpenLayers.Geometry.Point, "doNew").andReturn(point);
                point.transform.andReturn(webMercatorPoint);
                successHandler({ coords: { accuracy: accuracy, longitude: lon, latitude: lat } });
                expect(OpenLayers.Geometry.Point.doNew).toHaveBeenCalledWith(lon, lat);
                expect(point.transform).toHaveBeenCalledWith(proj.WGS84, proj.webMercator);
                expect(currentLocationLayer.setLocation).toHaveBeenCalledWith(webMercatorPoint, accuracy);
            });

            it("should give feedback if there was a timeout", function() {
                failureHandler({ error: { code: 3 }});
                expect(window.alert.mostRecentCall.args[0]).toMatch(/timed out before retrieving/);
            });

            it("should give feedback if the user denied permission", function() {
                failureHandler({ error: { code: 1 }});
                expect(window.alert.mostRecentCall.args[0]).toMatch(/not allowed to access/);
            });

            it("should give feedback if there was some other error", function() {
                failureHandler({ error: { code: 9, message: "extra message" }});
                expect(window.alert.mostRecentCall.args[0]).toMatch(/error.*: extra message$/);
            });
        });

        describe("#stopFollowing", function() {
            it("should clear the watch (of location)", function() {
                subject.stopFollowing();
                expect(window.navigator.geolocation.clearWatch).toHaveBeenCalledWith(fakeWatchId);
            });
        });

        describe("#isFollowing", function() {
            var newSubject;
            beforeEach(function() { newSubject = PoziGeolocate.doNew(currentLocationLayer); })

            it("should initially be false", function() {
                expect(newSubject.isFollowing()).toBe(false);
            });

            it("should become true when following is started", function() {
                newSubject.startFollowing();
                expect(newSubject.isFollowing()).toBe(true);
            });

            it("should become false again when following is stopped", function() {
                newSubject.startFollowing();
                newSubject.stopFollowing();
                expect(newSubject.isFollowing()).toBe(false);
            });
        });

    });

});

