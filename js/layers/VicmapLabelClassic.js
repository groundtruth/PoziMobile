define(["openlayers"], function(OpenLayers) {

    return function() {

        this.layer = OpenLayers.Layer.WMS.doNew("Labels",
            [
                "http://basemap1.pozi.com/geoserver/wms",
                "http://basemap2.pozi.com/geoserver/wms",
                "http://basemap3.pozi.com/geoserver/wms",
                "http://basemap4.pozi.com/geoserver/wms"
            ],
            {
                layers: 'VICMAP_CLASSIC:LabelClassic',
                format: 'image/png8',
                transparent: 'true'
            },
            {
                isBaseLayer: false,
                singleTile: true,
                ratio: 1.5
            }
        );

    };

});

