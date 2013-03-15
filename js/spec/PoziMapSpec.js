define(["spec/SpecHelper", "PoziMap", "layers", "openlayers"], function(SpecHelper, PoziMap, layers, OpenLayers) {

    describe("PoziMap", function() {
        var subject, detailsPage;
        
        // TODO: make PoziMap a wrapper not a subclass of OpenLayers.Map (then it can be better isolated in these specs, etc.).

        beforeEach(function() {
          setFixtures('<div id="map"></div>');
          spyOn(layers.data, "getFeaturesAround");
          detailsPage = jasmine.createSpyObj("detailsPage", ["update", "changeTo"]);
          subject = PoziMap.doNew(detailsPage);
        });

        it("should have meters as map units", function() {
            expect(subject.units).toEqual("m");
        });

        it("should set default zoom level", function() {
            expect(subject.zoom).toEqual(15);
        });

        describe("#seekToCurrentLocation", function() {
            var geolocate;

            beforeEach(function() {
                spyOn(layers.currentLocation, "clearLocationMarker");
                geolocate = jasmine.createSpyObj("geolocate", ["activate", "getCurrentLocation"]);
                spyOn(subject, "getControlsBy").andReturn([geolocate]);
            });

            it("should clear location markers before getting new location", function() {
                geolocate.activate.andCallFake(function() {
                    expect(layers.currentLocation.clearLocationMarker).toHaveBeenCalled();
                });
                subject.seekToCurrentLocation();
                expect(geolocate.activate).toHaveBeenCalled();
            });

            it("should getCurrentLocation() if already active", function() {
                geolocate.active = true;
                subject.seekToCurrentLocation();
                expect(geolocate.getCurrentLocation).toHaveBeenCalled();
            });

            it("should activate gelocaation if not already active", function() {
                geolocate.active = false;
                subject.seekToCurrentLocation();
                expect(geolocate.activate).toHaveBeenCalled();
            });

        });

        describe("#setSize", function() {
            it("should be set on initialization", function() {
            });
            it("should be set on resize", function() {
            });
            it("should be set on orientationchange", function() {
            });
            it("should be set on end of pan", function() {
            });
        });

        describe("#updateData",function() {
            it("should be done on initialization", function() {
            });
            it("should delegate to data layer with correct center point", function() {
            });
        });

    });

});

