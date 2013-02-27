define(["jquery", "openlayers", "config"], function($, OpenLayers, config) {

    // The style hardcodes the correspondance between a status code and the external graphic name
    // We tried with adduniquerules but OpenLayers.Rule does not seem defined in Openlayers mobile
    var layer = new OpenLayers.Layer.Vector(config.dataLayerName, {
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

        $.getJSON(
            config.readEndpoint,
            {
                lat: pointInWGS84.lat,
                lon: pointInWGS84.lon,
                limit: config.featuresLimit,
                config: config.databaseName
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

