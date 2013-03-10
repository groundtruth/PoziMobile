define(["spec/SpecHelper", "underscore", "proj", "layers/currentLocation"], function(SpecHelper, _, proj, currentLocation) {

    describe("layers/currentLocation", function() {
        var pointInWGS84, accuracy;

        beforeEach(function() {
            currentLocation.map = jasmine.createSpyObj("map", ["setCenterAndZoomToExtent"]);
            pointInWGS84 = OpenLayers.Geometry.Point.doNew(16136538.634305948, -4547536.7868166575);
            accuracy = 8.1;
        });

        describe("#clearLocationMarker", function() {
            it("should clear existing features from the layer", function() {
                currentLocation.setLocation(pointInWGS84, accuracy);
                currentLocation.clearLocationMarker();
                expect(currentLocation.features).toEqual([]);
            });
        });

        describe("#setLocation", function() {

            beforeEach(function() {
                spyOn(currentLocation, "destroyFeatures").andCallThrough();
                currentLocation.setLocation(pointInWGS84, accuracy);
            });

            it("should clear existing features", function() {
                expect(currentLocation.destroyFeatures).toHaveBeenCalledWith();
            });

            it("should place a cross at the specified location", function() {
                var crossFeature = _(currentLocation.features).select(function(f) { return f.style.graphicName === "cross"; })[0];
                expect(crossFeature.geometry.x).toEqual(pointInWGS84.x);
                expect(crossFeature.geometry.y).toEqual(pointInWGS84.y);
            });

            it("should create circle with radius of accuracy in map units (meters)", function() {
                var circleFeature = _(currentLocation.features).select(function(f) { return f.geometry.id.match(/Polygon/); })[0];
                var radius = (circleFeature.geometry.bounds.right - circleFeature.geometry.bounds.left) / 2;
                expect(radius).toBeCloseTo(accuracy, 5);
            });

            it("should tell the map to center and zoom to the current location markers", function() {
                var lonLatInWebMercator = OpenLayers.LonLat.doNew(pointInWGS84.x, pointInWGS84.y).transform(proj.WGS84, proj.webMercator)
                expect(currentLocation.map.setCenterAndZoomToExtent).toHaveBeenCalledWith(lonLatInWebMercator, currentLocation.getDataExtent());
            });

            afterEach(function() { currentLocation.clearLocationMarker(); });
        });

    });

});

