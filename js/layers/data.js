define(["jquery", "openlayers", "js/proj"], function($, OpenLayers, proj) {

    return function(config) {
        var that = this;

        var style = OpenLayers.Style.doNew({
            externalGraphic: config.iconFile,
            graphicOpacity: 1.0,
            graphicWith: 16,
            graphicHeight: 26,
            graphicYOffset: -26
        });

        var styleRules = _(config.styleRules).chain().map(function(styleRulesPart) {
            // these are expected to be arrays of OpenLayers.Style objects
            return require(styleRulesPart); // can require sync cos these were preloaded with the config
        }).flatten().value();

        // if any styleRules are present, default style won't work
        // (so custom ones should handle a default case too)
        style.addRules(styleRules);

        var styleMap = OpenLayers.StyleMap.doNew(style);

        that.layer = OpenLayers.Layer.Vector.doNew(config.dataLayerName, { styleMap: styleMap });

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

