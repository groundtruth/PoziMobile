define(['openlayers'], function (OpenLayers) {
  return function () {
    this.layer = OpenLayers.Layer.WMS.doNew('Labels',
      [
        'https://imageproxy.pozi.com/http://basemap1.pozi.com/geoserver/wms'
      ],
      {
        layers: 'VICMAP_CLASSIC:LabelClassic',
        format: 'image/png8',
        transparent: 'true',
        authkey: 'openlayers2noauth'
      },
      {
        isBaseLayer: false,
        singleTile: true,
        ratio: 1.5
      }
    )
  }
})
