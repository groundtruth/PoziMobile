define(["jquery", "openlayers", "js/config", "js/proj"], function($, OpenLayers, config, proj) {

    // The style hardcodes the correspondance between a status code and the external graphic name
    // We tried with adduniquerules but OpenLayers.Rule does not seem defined in Openlayers mobile
    var layer = OpenLayers.Layer.Vector.doNew(config.data().dataLayerName, {
        styleMap: OpenLayers.StyleMap.doNew({
            externalGraphic: config.data().iconFile,
            graphicOpacity: 1.0,
            graphicWith: 16,
            graphicHeight: 26,
            graphicYOffset: -26
        })
    });

    layer.getFeaturesAround = function(pointInWGS84) {

        var reader = OpenLayers.Format.GeoJSON.doNew({
            'internalProjection': proj.webMercator,
            'externalProjection': proj.WGS84
        });

        $.getJSON(
            config.data().restEndpoint + '/closest/'+pointInWGS84.lon+'/'+pointInWGS84.lat+'/limit/'+config.data().featuresLimit,
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

