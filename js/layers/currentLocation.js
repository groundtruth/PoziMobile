define(["openlayers"], function(OpenLayers) {

    var currentLocationLayer = OpenLayers.Layer.Vector.doNew("Current location", {});

    currentLocationLayer.clearLocationMarker = function() { this.removeAllFeatures(); }
    currentLocationLayer.setLocationFeatures = function(point, accuracy) {

        this.removeAllFeatures();
        this.addFeatures([
            OpenLayers.Feature.Vector.doNew(
                point,
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
                    OpenLayers.Geometry.Point.doNew(point.x, point.y),
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
        
    };

    return currentLocationLayer;

});

