define(['openlayers'], function (OpenLayers) {
  return function () {
    this.layer = OpenLayers.Layer.XYZ.doNew('Here Maps',
      'https://1.base.maps.api.here.com/maptiler/v2/maptile/newest/normal.day/${z}/${x}/${y}/256/png8?lg=ENG&app_id=NIEF2Bb3q1uSHV0AILtJ&token=ji8hmfQIabQA7--VT2HOAQ',
      {}
    )
  }
})
