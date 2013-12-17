define([
    "spec/SpecHelper",
    "js/PoziMap",
    "js/PoziGeolocate",
    "js/Layers",
    "openlayers"
], function(
    SpecHelper,
    PoziMap,
    PoziGeolocate,
    Layers,
    OpenLayers
) {

    describe("PoziMap", function() {
        var subject, detailsPage;
        var fakeGeolocate = jasmine.createSpyObj("geolocate", ["startFollowing", "stopFollowing", "isFollowing"]);
        var config = {
            "maxExtentBounds": [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
            "centerLon": 16245331,
            "centerLat": -4601721,
            "layers": []
            "defaultZoomLevel": 18,
            "maxZoom": 19
        };
        var layers = Layers.doNew(config);

        // TODO: make PoziMap a wrapper not a subclass of OpenLayers.Map (then it can be better isolated in these specs, etc.).

        beforeEach(function() {
          setFixtures('<div id="map"></div>');
          spyOn(Layers, "doNew").andReturn(layers);
          spyOn(layers.data, "getFeaturesAround");
          spyOn(OpenLayers.Control.SelectFeature, "doNew").andCallThrough();
          spyOn(PoziGeolocate, "doNew").andReturn(fakeGeolocate);
          detailsPage = jasmine.createSpyObj("detailsPage", ["update", "changeTo"]);
          detailsPage.update.andReturn(detailsPage);
          subject = PoziMap.doNew(detailsPage, config);
        });

        it("should have meters as map units", function() {
            expect(subject.units).toEqual("m");
        });

        it("should set default zoom level", function() {
            expect(subject.zoom).toEqual(18);
        });

        describe("geolocate functionality", function() {

            describe("#isFollowingLocation", function() {
                it("should delegate to PoziGeolocate#isFollowing", function() {
                    var geolocateResult = jasmine.createSpy("result");
                    fakeGeolocate.isFollowing.andReturn(geolocateResult);
                    var result = subject.isFollowingLocation();
                    expect(result).toBe(geolocateResult);
                })
            });

            describe("#startFollowingLocation", function() {
                it("should delegate to PoziGeolocate#startFollowing", function() {
                    subject.startFollowingLocation();
                    expect(fakeGeolocate.startFollowing).toHaveBeenCalled();
                })
            });

            describe("#stopFollowingLocation", function() {
                it("should delegate to PoziGeolocate#stopFollowing", function() {
                    subject.stopFollowingLocation();
                    expect(fakeGeolocate.stopFollowing).toHaveBeenCalled();
                })
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

        describe("#setCenterToPoint", function() {
            it("should set center correctly", function() {
                var point = { x: jasmine.createSpy("x coord"), y: jasmine.createSpy("y coord") };
                spyOn(subject, "setCenter");
                subject.setCenterToPoint(point);
                expect(subject.setCenter).toHaveBeenCalledWith([point.x, point.y])
            });
        });

        describe("#setCenterAndZoomToExtent", function() {
            it("should not zoom above configured max zoom", function() {
                spyOn(subject, "setCenter");
                var excessiveZoom = config.maxZoom * 2;
                spyOn(subject, "getZoomForExtent").andReturn(excessiveZoom);
                subject.setCenterAndZoomToExtent(subject.getCenter(), subject.getExtent());
                expect(subject.setCenter.mostRecentCall.args[1]).toBeLessThan(excessiveZoom);
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

