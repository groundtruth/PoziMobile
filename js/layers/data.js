define(["jquery", "openlayers"], function($, OpenLayers) {

    // The style hardcodes the correspondance between a status code and the external graphic name
    // We tried with adduniquerules but OpenLayers.Rule does not seem defined in Openlayers mobile
    var layer = new OpenLayers.Layer.Vector("Fire Hazards", {
        styleMap: new OpenLayers.StyleMap({
            externalGraphic: "img/mobile-loc-${haz_status}.png",
            graphicOpacity: 1.0,
            graphicWith: 16,
            graphicHeight: 26,
            graphicYOffset: -26
        })
    });

    layer.getFeaturesAround = function(pointInWebMercator) {

        var reader = new OpenLayers.Format.GeoJSON();
        var limit_feature = 20;

        $.getJSON(
            'http://v3.pozi.com/ws/rest/v3/ws_fire_hazard_geojson.php?callback=?',
            {
                lat: pointInWebMercator.lat,
                lon: pointInWebMercator.lon,
                limit: limit_feature,
                config: 'bendigogis',
                lga: '325'
            },
            function(data, textStatus) {
                var features = reader.read(data);
                layer.removeAllFeatures(); // could check for duplicates instead of just clearing all
                layer.addFeatures(features);
            }
        );

    };

    return layer;

});

