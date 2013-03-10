define(["openlayers", "proj"], function(OpenLayers, proj) {

    var currentLocationLayer = OpenLayers.Layer.Vector.doNew("Current location", {});

    currentLocationLayer.clearLocationMarker = function() { this.removeAllFeatures(); };
    currentLocationLayer.setLocation = function(pointInWGS84, accuracy) {


        this.removeAllFeatures();
        this.addFeatures([
            OpenLayers.Feature.Vector.doNew(
                pointInWGS84,
                {},
                {
                    graphicName: 'cross',
                    strokeColor: '#f00',
                    strokeWidth: 2,
                    fillOpacity: 0,
                    pointRadius: 10
                }
            ),
            OpenLayers.Feature.Vector.doNew(
                OpenLayers.Geometry.Polygon.createRegularPolygon(
                    OpenLayers.Geometry.Point.doNew(pointInWGS84.x, pointInWGS84.y),
                    accuracy / 2,
                    50,
                    0
                ),
                {},
                {
                    fillOpacity: 0.1,
                    fillColor: '#000',
                    strokeColor: '#f00',
                    strokeOpacity: 0.6
                }
            )
        ]);

        var point = OpenLayers.LonLat.doNew(pointInWGS84.x, pointInWGS84.y).transform(proj.WGS84, proj.webMercator);
        this.map.setCenterAndZoomToExtent(point, this.getDataExtent());
        
    };

    return currentLocationLayer;

});

