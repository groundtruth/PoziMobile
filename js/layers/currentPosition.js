define(["openlayers"], function(OpenLayers) {

    var currentPositionLayer = new OpenLayers.Layer.Vector("GPS position", {});

    currentPositionLayer.setPositionFeatures = function(point, accuracy) {

        this.removeAllFeatures();
        this.addFeatures([
            new OpenLayers.Feature.Vector(
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
            new OpenLayers.Feature.Vector(
                OpenLayers.Geometry.Polygon.createRegularPolygon(
                    new OpenLayers.Geometry.Point(point.x, point.y),
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

    return currentPositionLayer;

});

