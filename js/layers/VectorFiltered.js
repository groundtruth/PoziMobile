define(["openlayers", "js/proj"], function(OpenLayers, proj) {

    return function(options) {
        var that = this;

        this.layer = OpenLayers.Layer.Vector.doNew(options.name, {
            styleMap: OpenLayers.StyleMap.doNew(options.styleMap)
        });

        var equalToFilters = _(options.equalToFilters).chain().pairs().map(function(pair) {
            var field = pair[0], value = pair[1];
            return '\
                        <ogc:PropertyIsEqualTo>\
                            <ogc:PropertyName>' + field + '</ogc:PropertyName>\
                            <ogc:Literal>' + value.toString() + '</ogc:Literal>\
                        </ogc:PropertyIsEqualTo>\
                    ';
        }).value().join('');

        var notNullFilters = _(options.notNullFilters).chain().toArray().map(function(field) {
            return '\
                        <ogc:Not>\
                            <ogc:PropertyIsNull>\
                                <ogc:PropertyName>' + field + '</ogc:PropertyName>\
                            </ogc:PropertyIsNull>\
                        </ogc:Not>\
                    ';
        }).value().join('');

        var url =
            options.wfsEndpoint + "?" +
            _({
                service: "wfs",
                version: "2.0.0",
                request: "GetFeature",
                outputFormat: "application/json",
                srsName: proj.webMercator.projCode,
                typeName: options.layer,
                propertyName: options.properties,
                filter: ('\
                            <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">\
                                <ogc:And>\
                                    ' + equalToFilters + '\
                                    ' + notNullFilters + '\
                                </ogc:And>\
                            </ogc:Filter>\
                        ').trim().replace(/>\s+</g, '><')
            }).pairs().map(function(pair) {
                return _(pair).map(function(item) { return encodeURIComponent(item); }).join("=");
            }).join("&")
        ;

        OpenLayers.Request.GET({
            url: url,
            success: function(response) {
                var reader = OpenLayers.Format.GeoJSON.doNew();
                var features = reader.read(response.responseText);
                that.layer.addFeatures(features);
            }
        });

    };

});

