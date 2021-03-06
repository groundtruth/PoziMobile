define(["openlayers", "js/proj"], function(OpenLayers, proj) {

    var currentLocationLayer = OpenLayers.Layer.Vector.doNew("Current location", {});

    currentLocationLayer.clearLocationMarker = function() { this.destroyFeatures(); };
    currentLocationLayer.setLocation = function(pointInWebMercator, accuracy) {

        var alreadyHadFeatures = this.features.length > 0;

        this.destroyFeatures();
        this.addFeatures([
            OpenLayers.Feature.Vector.doNew(
                pointInWebMercator,
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
                    pointInWebMercator,
                    accuracy,
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

        if (alreadyHadFeatures) {
            this.map.setCenterToPoint(pointInWebMercator);
        } else {
            this.map.setCenterAndZoomToExtent(pointInWebMercator, this.getDataExtent());
        }

    };

    return currentLocationLayer;

});

