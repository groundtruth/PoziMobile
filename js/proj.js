define(["openlayers"], function(OpenLayers) {
    return {
      
        // GPS or query/response from web service
        webMercator: new OpenLayers.Projection("EPSG:4326"),
        
        // Google's spherical mercator, also for our tiles
        sphericalMercator: new OpenLayers.Projection("EPSG:900913")
    }
});

