define([
    "spec/SpecHelper",
    "underscore",
    "js/config",
    "js/Layers"
], function(
    SpecHelper,
    _,
    config,
    Layers
) {

    describe("Layers", function() {

        it("should use the Vicmaps basemap by default", function() {
            spyOn(config, "data").andReturn({ basemap: undefined });
            var layerNames = _(Layers.doNew().list).map(function(l) { return l.name; });
            expect(layerNames).toContain("Vicmap Classic");
            expect(layerNames).toContain("Labels");
            expect(layerNames).not.toContain("OpenStreetMap");
        });

        it("should use the OpenStreetMap basemap if so configured", function() {
            spyOn(config, "data").andReturn({ basemap: "OpenStreetMap" });
            var layerNames = _(Layers.doNew().list).map(function(l) { return l.name; });
            expect(layerNames).toContain("OpenStreetMap");
            expect(layerNames).not.toContain("Vicmap Classic");
            expect(layerNames).not.toContain("Labels");
        });

        it("should use the Bing roads basemap if so configured", function() {
            spyOn(config, "data").andReturn({ basemap: "BingRoad" });
            var layerNames = _(Layers.doNew().list).map(function(l) { return l.name; });
            expect(layerNames).toContain("Bing Road");
            expect(layerNames).not.toContain("Vicmap Classic");
            expect(layerNames).not.toContain("Labels");
        });

        it("should use the Bing aerial with labels basemap if so configured", function() {
            spyOn(config, "data").andReturn({ basemap: "BingAerialWithLabels" });
            var layerNames = _(Layers.doNew().list).map(function(l) { return l.name; });
            expect(layerNames).toContain("Bing Aerial + Labels");
            expect(layerNames).not.toContain("Vicmap Classic");
            expect(layerNames).not.toContain("Labels");
        });

        it("should show the vector roads layer if so configured", function() {
            spyOn(config, "data").andReturn({ showVectorRoads: true, lga: 338 });
            var layerNames = _(Layers.doNew().list).map(function(l) { return l.name; });
            expect(layerNames).toContain("Vector Roads");
        });

        it("should not show the vector roads layer unless asked", function() {
            spyOn(config, "data").andReturn({ showVectorRoads: false, lga: 338 });
            var layerNames = _(Layers.doNew().list).map(function(l) { return l.name; });
            expect(layerNames).not.toContain("Vector Roads");
        });


    });

});

