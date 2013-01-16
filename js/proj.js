define(["openlayers"], function(OpenLayers) {
    return {
        webMercator: new OpenLayers.Projection("EPSG:4326"),
        sphericalMercator: new OpenLayers.Projection("EPSG:900913")
    }
});

