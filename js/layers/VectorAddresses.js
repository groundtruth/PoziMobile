define(["openlayers", "proj"], function(OpenLayers, proj) {

    return function(lga) {
        var that = this;

        this.layer = OpenLayers.Layer.Vector.doNew("Vector Roads", {
            styleMap: OpenLayers.StyleMap.doNew({
                label: "${num_add}",
                labelOutlineColor: "white",
                labelOutlineWidth: 4,
                fontSize: 10,
                fontWeight: "bold",
                strokeColor: "#888888",
                strokeOpacity: 1
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
                typeName: "VICMAP_CLASSIC:dse_vmadd_address",
                propertyName: "num_add,the_geom",
                filter: ('\
                            <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">\
                                <ogc:And>\
                                    <ogc:PropertyIsEqualTo>\
                                        <ogc:PropertyName>lga_code</ogc:PropertyName>\
                                        <ogc:Literal>' + lga.toString() + '</ogc:Literal>\
                                    </ogc:PropertyIsEqualTo>\
                                    <ogc:Not>\
                                        <ogc:PropertyIsNull>\
                                            <ogc:PropertyName>num_add</ogc:PropertyName>\
                                        </ogc:PropertyIsNull>\
                                    </ogc:Not>\
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

