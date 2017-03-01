define(['openlayers'], function (OpenLayers) {
  return function () {
    this.layer = OpenLayers.Layer.WMS.doNew('Vicmap Classic',
      [
        'https://imageproxy.pozi.com/http://basemap1.pozi.com/geoserver/wms'
      ],
      {
        layers: 'VICMAP_CLASSIC:VicmapClassic',
        format: 'image/png8',
        tiled: true,
        authkey: 'openlayers2noauth'
      },
      {
        transitionEffect: 'resize'
      }
    )
  }
})
