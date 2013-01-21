define(["jquery", "openlayers", "proj"], function($, OpenLayers, proj) {

    // The style hardcodes the correspondance between a status code and the external graphic name
    // We tried with adduniquerules but OpenLayers.Rule does not seem defined in Openlayers mobile
    var layer = new OpenLayers.Layer.Vector("Fire Hazards", {
        styleMap: new OpenLayers.StyleMap({
            externalGraphic: "img/mobile-loc-${haz_status}.png",
            graphicOpacity: 1.0,
            graphicWith: 16,
            graphicHeight: 26,
            graphicYOffset: -26
        })
    });


    layer.getFeaturesAround = function(pointInSpherical) {
        var ll_wgs84 = pointInSpherical.transform(proj.sphericalMercator, proj.webMercator);

        var reader = new OpenLayers.Format.GeoJSON();
        var limit_feature = 20;


        $.getJSON(
            'http://v3.pozi.com/ws/rest/v3/ws_fire_hazard_geojson.php?callback=?',
            {
                lat: ll_wgs84.lat,
                lon: ll_wgs84.lon,
                limit: limit_feature,
                config: 'bendigogis',
                lga: '325'
            },
            // function(data, textStatus) {
            //     alert('the data is: '+JSON.stringify(data)+" and textStatus is "+textStatus);
            // }
            function(data, textStatus) {
                var fh_from_geojson = reader.read(data);

                // alert('the fh_from_geojson is: '+JSON.stringify(fh_from_geojson)+" and textStatus is "+textStatus);
                //
                // Before blindly adding, we should compare to the features already in there and decide to not include duplicates - duplicates can be found using the id of the features
                // Or more simply, we could just remove all the features form the layer
                layer.removeAllFeatures();
                layer.addFeatures(fh_from_geojson);
            }
        );


        // Ext.util.JSONP.request({
        //     url: '/ws/rest/v3/ws_fire_hazard_geojson.php',
        //     params: {
        //         lat: ll_wgs84.lat,
        //         lon: ll_wgs84.lon,
        //         limit: limit_feature,
        //         config: 'bendigogis',
        //         lga: '325'
        //     },
        //     callbackKey: 'callback',
        //     callback: function(resp) {
        //         // resp is the XmlHttpRequest object
        //         var fh_from_geojson = reader.read(resp);
        //         // Before blindly adding, we should compare to the features already in there and decide to not include duplicates - duplicates can be found using the id of the features
        //         // Or more simply, we could just remove all the features form the layer
        //         that.removeAllFeatures();
        //         that.addFeatures(fh_from_geojson);
        //     }
        // });
    };

    return layer;

});

