define(["openlayers", "proj"], function(OpenLayers, proj) {

    return function() {
        var map = new OpenLayers.Map({
            div: "map",
            theme: null,
            projection: proj.sphericalMercator,
            units: "m",
            numZoomLevels: 20,
            maxResolution: 156543.0339,
            maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
            controls: [
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.TouchNavigation({
                    dragPanOptions: {
                        interval: 100,
                        enableKinetic: true
                    }
                })
            ],
            // center: new OpenLayers.LonLat(16061635, -4405394),
            center: new OpenLayers.LonLat(16061608, -4405233),
            zoom: 15
        });

        map.getCenterInWebMercator = function() {
            return this.getCenter().transform(proj.sphericalMercator, proj.webMarcator);
        };

        map.setCenterAndZoomToExtent = function(locationInSpherical, extent) {
            var zoomWithinLimit = Math.min(this.getZoomForExtent(extent), 18);
            this.setCenter(locationInSperhical, zoomWithinLimit);
        };

        return map;
    };

});
  

