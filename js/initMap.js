define([
    "openlayers",
    "PoziMap",
    "PoziGeolocate",
    "layers"
], function(
    OpenLayers,
    PoziMap,
    PoziGeolocate,
    layers
) {

    return function() {

        var map = new PoziMap();

        map.addLayers(layers);

        map.addControls([
            new PoziGeolocate(map, layers.currentPosition),
            new OpenLayers.Control.SelectFeature(layers.data, {
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

        map.events.register('moveend', this, function() { layers.data.getFeaturesAround(map.getCenterInWebMercator()); });

        layers.data.getFeaturesAround(map.getCenterInWebMercator());
    };

});

