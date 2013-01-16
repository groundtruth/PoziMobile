define([
    "openlayers",
    "PoziMap",
    "proj",
    "dataLayer",
    "bingLayers",
    "vicmapLayers",
    "geolocate"
], function(
    OpenLayers,
    PoziMap,
    proj,
    dataLayer,
    bingLayers,
    vicmapLayers,
    geolocate
) {

    return function() {

        // initialize map when page ready
        var map,
            getFeatures,
            selectControl;

        var limit_feature = 20;

        var currentPositionLayer = new OpenLayers.Layer.Vector("GPS position", {});

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

        map.events.register('moveend', this, function() { getFeatures(); });

        var style = {
            fillOpacity: 0.1,
            fillColor: '#000',
            strokeColor: '#f00',
            strokeOpacity: 0.6
        };

        geolocate.events.register("locationupdated", this, function(e) {
                // Logging the event values
                var pt = new OpenLayers.LonLat(e.point.x, e.point.y);
                var pt_google = pt.transform(proj.webMercator, proj.sphericalMercator);

                currentPositionLayer.removeAllFeatures();
                currentPositionLayer.addFeatures([
                    new OpenLayers.Feature.Vector(
                        e.point,
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
                            new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                            e.position.coords.accuracy / 2,
                            50,
                            0
                        ),
                        {},
                        style
                    )
                ]);
                // Zoom to the disc derived from GPS position and accuracy, with a max zoom level of 17
                var z = map.getZoomForExtent(currentPositionLayer.getDataExtent());
                map.setCenter(pt_google, Math.min(z, 18));
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


        getFeatures = function() {
            var ll = map.getCenter();
            var ll_wgs84 = ll.transform(proj.sphericalMercator, proj.webMercator);

            var reader = new OpenLayers.Format.GeoJSON();

            // Ext.util.JSONP.request({
            //     url: '/ws/rest/v3/ws_fire_hazard_geojson.php',
            //     params: {
            //         lat: ll_wgs84.lat,
            //         lon: ll_wgs84.lon,
            //         limit: limit_feature,
            //         config: 'bendigogis',
            //         lga: '325'
            //     },
            //     callbackKey: 'callback',
            //     callback: function(resp) {
            //         // resp is the XmlHttpRequest object
            //         var fh_from_geojson = reader.read(resp);
            //         // Before blindly adding, we should compare to the features already in there and decide to not include duplicates - duplicates can be found using the id of the features
            //         // Or more simply, we could just remove all the features form the layer
            //         dataLayer.removeAllFeatures();
            //         dataLayer.addFeatures(fh_from_geojson);
            //     }
            // });
        };

        // Loading features in the fire hazard layer - AJAX GeoJSON
        getFeatures();
    };

});

