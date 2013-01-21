define([
    "openlayers",
    "PoziMap",
    "proj",
    "dataLayer",
    "bingLayers",
    "vicmapLayers",
    "currentPositionLayer",
    "geolocate"
], function(
    OpenLayers,
    PoziMap,
    proj,
    dataLayer,
    bingLayers,
    vicmapLayers,
    currentPositionLayer,
    geolocate
) {

    return function() {

        // initialize map when page ready
        var map,
            selectControl;

        var onSelectFeatureFunction = function(feature) {
            var clickedFeature = feature;
            if (!app.captureUpdateFormPopupPanel) {

                app.captureUpdateFormPopupPanel = new App.CaptureUpdateFormPopupPanel();

            } else {
                // Updating the lat / lon values in the existing form
                app.captureUpdateFormPopupPanel.setFeature(clickedFeature);
            }
            app.captureUpdateFormPopupPanel.show('pop');
        };


        selectControl = new OpenLayers.Control.SelectFeature(dataLayer, {
            autoActivate: true,
            onSelect: onSelectFeatureFunction
        });


        // create map
        map = PoziMap();
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
            geolocate,
            selectControl
        ]);

        map.events.register('moveend', this, function() { dataLayer.getFeaturesAround(map.getCenterInWebMercator()); });

        geolocate.events.register("locationupdated", this, function(e) {
                var locationInSperhical = OpenLayers.LonLat(e.point.x, e.point.y).transform(proj.webMercator, proj.sphericalMercator);
                currentPositionLayer.setPositionFeatures(e.point, e.position.coords.accuracy);
                map.setCenterAndZoomToExtent(locationInSpherical, currentPositionLayer.getDataExtent())
            }
        );

        geolocate.events.register("locationfailed", this, function(e) {
            switch (e.error.code) {
                case 0: alert(OpenLayers.i18n("There was an error while retrieving your location: ") + e.error.message); break;
                case 1: alert(OpenLayers.i18n("The user didn't accept to provide the location: ")); break;
                case 2: alert(OpenLayers.i18n("The browser was unable to determine your location: ") + e.error.message); break;
                case 3: alert(OpenLayers.i18n("The browser timed out before retrieving the location.")); break;
            }
        });


        // Loading features in the fire hazard layer - AJAX GeoJSON
        dataLayer.getFeaturesAround(map.getCenterInWebMercator());
    };

});

