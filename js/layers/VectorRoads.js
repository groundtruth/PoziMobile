define(["openlayers", "proj"], function(OpenLayers, proj) {

    return function(lga) {
        var that = this;

        this.layer = OpenLayers.Layer.Vector.doNew("Vector Roads", {
            styleMap: OpenLayers.StyleMap.doNew({
                strokeWidth: 1,
                strokeColor: "#FF0000",
            })
        });

        var url = "http://basemap.pozi.com/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&outputFormat=application/json&srsName=EPSG:3857&typeName=VICMAP_CLASSIC:gt_vmtrans_road_aggr_lga&filter=%3Cogc%3AFilter%20xmlns%3Aogc%3D%22http%3A%2F%2Fwww.opengis.net%2Fogc%22%3E%3Cogc%3APropertyIsEqualTo%3E%3Cogc%3APropertyName%3Elga%3C%2Fogc%3APropertyName%3E%3Cogc%3ALiteral%3E" + lga + "%3C%2Fogc%3ALiteral%3E%3C%2Fogc%3APropertyIsEqualTo%3E%3C%2Fogc%3AFilter%3E";

        OpenLayers.Request.GET({
            url: url,
            success: function(response) {
                var reader = OpenLayers.Format.GeoJSON.doNew({
                    externalProjection: proj.webMercator,
                    internalProjection: proj.webMercator
                });
                var features = reader.read(response.responseText);
                that.layer.addFeatures(features);
            }
        });

    };

});

