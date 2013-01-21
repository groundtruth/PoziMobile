define([
    "openlayers",
    "PoziMap",
    "dataLayer",
    "bingLayers",
    "vicmapLayers",
    "currentPositionLayer",
    "PoziGeolocate"
], function(
    OpenLayers,
    PoziMap,
    dataLayer,
    bingLayers,
    vicmapLayers,
    currentPositionLayer,
    PoziGeolocate
) {

    return function() {

        var map = new PoziMap();

        map.addLayers([
            vicmapLayers.labelClassic,
            vicmapLayers.classic,
            bingLayers.road,
            bingLayers.aerial,
            bingLayers.aerialWithLabels,
            new OpenLayers.Layer.OSM("OpenStreetMap", null, { transitionEffect: 'resize' }),
            currentPositionLayer,
            dataLayer
        ]);

        map.addControls([
            new PoziGeolocate(map, currentPositionLayer),
            new OpenLayers.Control.SelectFeature(dataLayer, {
                autoActivate: true,
                onSelect: function(feature) {
                    alert("onSelectFeatureFunction is not implemented!");
                    // var clickedFeature = feature;
                    // if (!app.captureUpdateFormPopupPanel) {
                    //     app.captureUpdateFormPopupPanel = new App.CaptureUpdateFormPopupPanel();
                    // } else {
                    //     // Updating the lat / lon values in the existing form
                    //     app.captureUpdateFormPopupPanel.setFeature(clickedFeature);
                    // }
                    // app.captureUpdateFormPopupPanel.show('pop');
                }
            })
        ]);

        map.events.register('moveend', this, function() { dataLayer.getFeaturesAround(map.getCenterInWebMercator()); });

        dataLayer.getFeaturesAround(map.getCenterInWebMercator());
    };

});

