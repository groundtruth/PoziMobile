define(["openlayers"], function(OpenLayers) {
    return {
      
        // WGS 84 (ellipsoid), used for GPS and interacting with our web services
        WGS84: new OpenLayers.Projection("EPSG:4326"),
        
        // Google's web mercator (spherical), used for our tiles
        webMercator: new OpenLayers.Projection("EPSG:900913")

    }
});

