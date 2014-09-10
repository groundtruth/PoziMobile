define(["jquery", "openlayers", "js/proj", "js/pages/Details"], function($, OpenLayers, proj, Details) {

    return function(rawLayerConfig, syncher) {
        var that = this;

        var optionsDefaults = {
            "idField": "id",
            "iconFile": "img/mobile-loc-1.png",
            "featuresLimit": 20,
            "handlesNewFeatures": false
        };

        var options = _.defaults(rawLayerConfig.options, optionsDefaults);

        var style = OpenLayers.Style.doNew({
            externalGraphic: options.iconFile,
            graphicOpacity: 1.0,
            graphicWith: 16,
            graphicHeight: 26,
            graphicYOffset: -26
        });

        var styleRules = _(options.styleRules).chain().map(function(styleRulesPart) {
            // these are expected to be arrays of OpenLayers.Style objects
            return require(styleRulesPart); // can require sync cos these were preloaded with the config
        }).flatten().value();

        // if any styleRules are present, default style won't work
        // (so custom ones should handle a default case too)
        style.addRules(styleRules);

        var styleMap = OpenLayers.StyleMap.doNew(style);

        that.layer = OpenLayers.Layer.Vector.doNew(options.name, { styleMap: styleMap });

        that.layer.getFeaturesAround = function(pointInWGS84) {

            var reader = OpenLayers.Format.GeoJSON.doNew({
                'internalProjection': proj.webMercator,
                'externalProjection': proj.WGS84
            });

            // Default query calculates distance to all features
            var restful_geof_endpoint = options.displayEndpoint+'/closest/'+pointInWGS84.lon+'/'+pointInWGS84.lat+'/limit/'+options.featuresLimit;

            // If a radius is provided, we can use the "maround" keyword
            if (options.radiusLimit)
            {
                restful_geof_endpoint = options.displayEndpoint+'/'+options.radiusLimit+'/maround/'+pointInWGS84.lon+'/'+pointInWGS84.lat+'/limit/'+options.featuresLimit;
            }

            $.getJSON(
                restful_geof_endpoint,
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

        var detailsPage = Details.doNew(syncher, options);

        var jsonGeometryPartAt = function(pointInWGS84) {
            if (options.propogateGeometry) {
                return {
                    "geometry": {
                        "type": "Point",
                        "crs": { "type": "name", "properties": { "name": "EPSG:4326" } },
                        "coordinates": [parseFloat(pointInWGS84.x), parseFloat(pointInWGS84.y)]
                    }
                };
            } else {
                return {};
            }
        };

        that.layer.controls = function() {
            return [
                OpenLayers.Control.SelectFeature.doNew(that.layer, {
                    autoActivate: true,
                    onSelect: function(olFeature) {
                        this.unselect(olFeature);

                        var pointInWGS84 = olFeature.geometry.transform(proj.webMercator, proj.WGS84);
                        var feature = _({
                            "type": "Feature",
                            "properties": _(olFeature.data).pick(options.fieldsToPropogate)
                        }).extend(jsonGeometryPartAt(pointInWGS84));

                        detailsPage.new(feature).changeTo();
                    }
                })
            ];
        };

        that.layer.handlesNewFeatures = function() {
            return !!options.handlesNewFeatures;
        };

        that.layer.newAt = function(position) {
            alert("It is not possible to add new features to this layer");
        };
    };

});

