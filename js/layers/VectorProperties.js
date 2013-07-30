define(["openlayers", "proj"], function(OpenLayers, proj) {

    return function(lga) {
        var that = this;

        this.layer = OpenLayers.Layer.Vector.doNew("Vector Properties", {
            styleMap: OpenLayers.StyleMap.doNew({
                stroke: 0.5,
                strokeOpacity: 1,
                strokeColor:"#555555",
                fill: false
            })
        });

        var url =
            "http://basemap.pozi.com/geoserver/wfs?" +
            _({
                service: "wfs",
                version: "2.0.0",
                request: "GetFeature",
                outputFormat: "application/json",
                srsName: proj.webMercator.projCode,
                typeName: "VICMAP_CLASSIC:gt_property_address",
                propertyName: "the_geom",
                filter: ('\
                            <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">\
                                <ogc:PropertyIsEqualTo>\
                                    <ogc:PropertyName>lga_code</ogc:PropertyName>\
                                    <ogc:Literal>' + lga.toString() + '</ogc:Literal>\
                                </ogc:PropertyIsEqualTo>\
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

