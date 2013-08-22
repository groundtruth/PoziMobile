define(["jquery", "openlayers", "js/config"], function($, OpenLayers, config) {

    // The style hardcodes the correspondance between a status code and the external graphic name
    // We tried with adduniquerules but OpenLayers.Rule does not seem defined in Openlayers mobile
    var layer = OpenLayers.Layer.Vector.doNew(config.data().dataLayerName, {
        styleMap: OpenLayers.StyleMap.doNew({
            externalGraphic: "img/"+(config.data().iconName?config.data().iconName:"mobile-loc-1.png"),
            graphicOpacity: 1.0,
            graphicWith: 16,
            graphicHeight: 26,
            graphicYOffset: -26
        })
    });

    layer.getFeaturesAround = function(pointInWGS84) {

        var reader = OpenLayers.Format.GeoJSON.doNew();

        $.getJSON(
            config.data().readEndpoint,
            {
                lat: pointInWGS84.lat,
                lon: pointInWGS84.lon,
                limit: config.data().featuresLimit,
                config: config.data().databaseName
            },
            function(data, textStatus) {
                // note: the textStatus parameter is undefined (see "As of jQuery 1.5" in http://api.jquery.com/jQuery.getJSON/)
                var features = reader.read(data);
                if (features.length > 0) {
                    layer.destroyFeatures(); // could check for duplicates instead of just clearing all
                    layer.addFeatures(features);
                }
            }
        );

    };

    return layer;

});

