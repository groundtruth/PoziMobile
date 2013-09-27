define(["openlayers"], function(OpenLayers) {
    return {

        // WGS 84 (ellipsoid), used for GPS and interacting with our web services
        WGS84: OpenLayers.Projection.doNew("EPSG:4326"),

        // Google's web mercator (spherical), used for our tiles
        // http://gis.stackexchange.com/questions/40538/what-is-the-difference-between-epsg900913-and-epsg3857
        webMercator: OpenLayers.Projection.doNew("EPSG:3857")

    }
});

