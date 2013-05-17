define(["spec/SpecHelper", "underscore", "proj", "layers/currentLocation"], function(SpecHelper, _, proj, currentLocation) {

    describe("layers/currentLocation", function() {
        var point, accuracy, oldMap;

        beforeEach(function() {
            oldMap = currentLocation.map; // TODO: consider making layers classes to avoid this
            currentLocation.map = jasmine.createSpyObj("map", ["setCenterAndZoomToExtent"]);
            point = OpenLayers.Geometry.Point.doNew(16136538.634305948, -4547536.7868166575).transform(proj.WGS84, proj.webMercator);
            accuracy = 8.1;
        });
        afterEach(function() { currentLocation.map = oldMap; })

        describe("#clearLocationMarker", function() {
            it("should clear existing features from the layer", function() {
                currentLocation.setLocation(point, accuracy);
                currentLocation.clearLocationMarker();
                expect(currentLocation.features).toEqual([]);
            });
        });

        describe("#setLocation", function() {

            beforeEach(function() {
                spyOn(currentLocation, "destroyFeatures").andCallThrough();
                currentLocation.setLocation(point, accuracy);
            });

            it("should clear existing features", function() {
                expect(currentLocation.destroyFeatures).toHaveBeenCalledWith();
            });

            it("should place a cross at the specified location", function() {
                var crossFeature = _(currentLocation.features).select(function(f) { return f.style.graphicName === "cross"; })[0];
                expect(crossFeature.geometry.x).toEqual(point.x);
                expect(crossFeature.geometry.y).toEqual(point.y);
            });

            it("should create circle with radius of accuracy in map units (meters)", function() {
                var circleFeature = _(currentLocation.features).select(function(f) { return f.geometry.id.match(/Polygon/); })[0];
                var radius = (circleFeature.geometry.bounds.right - circleFeature.geometry.bounds.left) / 2;
                expect(radius).toBeCloseTo(accuracy, 0.001);
            });

            it("should tell the map to center and zoom to the current location markers", function() {
                expect(currentLocation.map.setCenterAndZoomToExtent).toHaveBeenCalledWith(point, currentLocation.getDataExtent());
            });

            it("should tell the map to center but not zoom if already had location marker", function() {
                currentLocation.map.setCenterAndZoomToExtent.reset();
                currentLocation.setLocation(point, accuracy);
                expect(currentLocation.map.setCenterAndZoomToExtent).not.toHaveBeenCalledWith(point, currentLocation.getDataExtent());
                expect(currentLocation.map.setCenterAndZoomToExtent).toHaveBeenCalledWith(point);
            });

            afterEach(function() { currentLocation.clearLocationMarker(); });
        });

    });

});

