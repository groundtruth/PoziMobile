define(["openlayers"], function(OpenLayers) {
    return {
      
        // WGS 84 (ellipsoid), used for GPS and interacting with our web services
        WGS84: OpenLayers.Projection.doNew("EPSG:4326"),
        
        // Google's web mercator (spherical), used for our tiles
        webMercator: OpenLayers.Projection.doNew("EPSG:900913")

    }
});

