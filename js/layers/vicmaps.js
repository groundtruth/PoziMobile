define(["openlayers"], function(OpenLayers) {

    return {

        labelClassic: new OpenLayers.Layer.WMS("Labels",
            [
                "http://m1.pozi.com/geoserver/wms",
                "http://m2.pozi.com/geoserver/wms",
                "http://m3.pozi.com/geoserver/wms",
                "http://m4.pozi.com/geoserver/wms"
            ],
            {
                layers: 'LabelClassic',
                format: 'image/png8',
                transparent: 'true'
            },
            {
                isBaseLayer: false,
                singleTile: true,
                ratio: 1.5
            }
        ),

        classic: new OpenLayers.Layer.WMS("Vicmap Classic",
            [
                "http://m1.pozi.com/geoserver/gwc/service/wms",
                "http://m2.pozi.com/geoserver/gwc/service/wms",
                "http://m3.pozi.com/geoserver/gwc/service/wms",
                "http://m4.pozi.com/geoserver/gwc/service/wms"
            ],
            {
                layers: 'VicmapClassic',
                format: 'image/png8'
            },
            { transitionEffect: 'resize' }
        )

    };

});

