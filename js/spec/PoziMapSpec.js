define([
    "spec/SpecHelper",
    "PoziMap",
    "layers",
    "openlayers",
    "config"
], function(
    SpecHelper,
    PoziMap,
    layers,
    OpenLayers,
    config
) {

    describe("PoziMap", function() {
        var subject, detailsPage;
        
        // TODO: make PoziMap a wrapper not a subclass of OpenLayers.Map (then it can be better isolated in these specs, etc.).

        beforeEach(function() {
          setFixtures('<div id="map"></div>');
          spyOn(layers.data, "getFeaturesAround");
          spyOn(OpenLayers.Control.SelectFeature, "doNew").andCallThrough();
          detailsPage = jasmine.createSpyObj("detailsPage", ["update", "changeTo"]);
          detailsPage.update.andReturn(detailsPage);
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
                expect($("#map").attr("style")).toMatch(/height: \d+px/)
            });

            it("should be set on resize", function() {
                spyOn(subject, "setSize");
                $(window).trigger("resize");
                expect(subject.setSize).toHaveBeenCalled();
            });

            it("should be set on orientationchange", function() {
                spyOn(subject, "setSize");
                $(window).trigger("orientationchange");
                expect(subject.setSize).toHaveBeenCalled();
            });

        });

        describe("#setCenterAndZoomToExtent", function() {

            it("should not zoom above configured max zoom", function() {
                spyOn(subject, "setCenter");
                var excessiveZoom = config.data().maxZoom * 2;
                spyOn(subject, "getZoomForExtent").andReturn(excessiveZoom);
                subject.setCenterAndZoomToExtent(subject.getCenter(), subject.getExtent());
                expect(subject.setCenter.mostRecentCall.args[1]).toBeLessThan(excessiveZoom);
            });

            it("should be set on orientationchange", function() {
                spyOn(subject, "setSize");
                $(window).trigger("orientationchange");
                expect(subject.setSize).toHaveBeenCalled();
            });

        });

        describe("#updateData",function() {

            it("should delegate to data layer with a (center) point", function() {
                layers.data.getFeaturesAround.reset();
                subject.updateData();
                expect(layers.data.getFeaturesAround).toHaveBeenCalled();
                expect(layers.data.getFeaturesAround.mostRecentCall.args[0].lon).toEqual(jasmine.any(Number));
                expect(layers.data.getFeaturesAround.mostRecentCall.args[0].lat).toEqual(jasmine.any(Number));
            });

            it("should be done on initialization", function() {
                expect(layers.data.getFeaturesAround).toHaveBeenCalled();
            });

            it("should be done upon finish of pan", function() {
                spyOn(subject, "updateData");
                subject.events.triggerEvent("moveend");
                expect(subject.updateData).toHaveBeenCalled();
            });

        });

        describe("select feature handler", function() {
            var control, feature;

            beforeEach(function() {
                var handler = OpenLayers.Control.SelectFeature.doNew.mostRecentCall.args[1].onSelect;
                var unselect = jasmine.createSpy("unselect")
                control = { unselect: unselect, handler: handler }
                feature = jasmine.createSpy("feature");
            });

            it("should unselect the feature", function() {
                control.handler(feature);
                expect(control.unselect).toHaveBeenCalledWith(feature);
            });
            
        });

    });

});

