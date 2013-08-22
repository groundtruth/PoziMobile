define(["openlayers", "js/proj"], function(OpenLayers, proj) {

    return function(lga) {
        var that = this;

        this.layer = OpenLayers.Layer.Vector.doNew("Vector Roads", {
            styleMap: OpenLayers.StyleMap.doNew({
                strokeWidth: 5,
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
                typeName: "VICMAP_CLASSIC:gt_vmtrans_road_aggr_lga",
                propertyName: "the_geom",
                filter: ('\
                            <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">\
                                <ogc:PropertyIsEqualTo>\
                                    <ogc:PropertyName>lga</ogc:PropertyName>\
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

