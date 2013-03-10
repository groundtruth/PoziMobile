define(["spec/SpecHelper", "layers/currentLocation"], function(SpecHelper, currentLocation) {

    describe("layers/currentLocation", function() {
        var pointInWGS84, accuracy;

        beforeEach(function() {
            currentLocation.map = jasmine.createSpyObj("map", ["setCenterAndZoomToExtent"]);
            pointInWGS84 = OpenLayers.Geometry.Point.doNew(16136538.634305948, -4547536.7868166575);
            accuracy = 8.0;
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

            xit("should place point at specified location", function() {
                debugger;
            });

            xit("should create circle with radius of accuracy in map units (meters)", function() {
            });

            xit("should tell the map to center and zoom to the current location markers", function() {
            });

            afterEach(function() { currentLocation.clearLocationMarker(); });
        });

    });

});

