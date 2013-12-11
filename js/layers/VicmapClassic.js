define(["openlayers"], function(OpenLayers) {

    return function() {

        this.layer = OpenLayers.Layer.WMS.doNew("Vicmap Classic",
            [
                "http://basemap1.pozi.com/geoserver/wms",
                "http://basemap2.pozi.com/geoserver/wms",
                "http://basemap3.pozi.com/geoserver/wms",
                "http://basemap4.pozi.com/geoserver/wms"
            ],
            {
                layers: 'VICMAP_CLASSIC:VicmapClassic',
                format: 'image/png8',
                tiled: true
            },
            {
                transitionEffect: 'resize'
            }
        );

    };

});

