define(["jquery", "openlayers", "js/proj"], function($, OpenLayers, proj) {

    return function(config) {
        var that = this;

        // The style hardcodes the correspondance between a status code and the external graphic name
        // We tried with adduniquerules but OpenLayers.Rule does not seem defined in Openlayers mobile
        that.layer = OpenLayers.Layer.Vector.doNew(config.dataLayerName, {
            styleMap: OpenLayers.StyleMap.doNew({
                externalGraphic: config.iconFile,
                graphicOpacity: 1.0,
                graphicWith: 16,
                graphicHeight: 26,
                graphicYOffset: -26
            })
        });

        that.layer.getFeaturesAround = function(pointInWGS84) {

            var reader = OpenLayers.Format.GeoJSON.doNew({
                'internalProjection': proj.webMercator,
                'externalProjection': proj.WGS84
            });

            $.getJSON(
                config.restEndpoint + '/closest/'+pointInWGS84.lon+'/'+pointInWGS84.lat+'/limit/'+config.featuresLimit,
                function(data, textStatus) {
                    // note: the textStatus parameter is undefined (see "As of jQuery 1.5" in http://api.jquery.com/jQuery.getJSON/)
                    var features = reader.read(data);
                    if (features.length > 0) {
                        that.layer.destroyFeatures(); // could check for duplicates instead of just clearing all
                        that.layer.addFeatures(features);
                    }
                }
            );

        };
    };

});

