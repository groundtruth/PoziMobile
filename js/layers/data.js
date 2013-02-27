define(["jquery", "openlayers"], function($, OpenLayers) {

    // The style hardcodes the correspondance between a status code and the external graphic name
    // We tried with adduniquerules but OpenLayers.Rule does not seem defined in Openlayers mobile
    var layer = new OpenLayers.Layer.Vector("Minor Culverts", {
        styleMap: new OpenLayers.StyleMap({
            externalGraphic: "img/mobile-loc-1.png",
            graphicOpacity: 1.0,
            graphicWith: 16,
            graphicHeight: 26,
            graphicYOffset: -26
        })
    });

    layer.getFeaturesAround = function(pointInWGS84) {

        var reader = new OpenLayers.Format.GeoJSON();
        var limit_feature = 20;

        $.getJSON(
            'http://v3.pozi.com/ws/rest/v3/ws_minor_culvert_geojson.php?callback=?',
            {
                lat: pointInWGS84.lat,
                lon: pointInWGS84.lon,
                limit: limit_feature,
                config: 'loddongis'
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

