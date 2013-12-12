define([
    "underscore",
    "js/layers/Bing",
    "js/layers/VicmapClassic",
    "js/layers/VicmapLabelClassic",
    "js/layers/VectorFiltered",
    "js/layers/currentLocation",
    "js/layers/Data",
    "js/pages/Details"
], function(
    _,
    Bing,
    VicmapClassic,
    VicmapLabelClassic,
    VectorFiltered,
    currentLocation,
    Data,
    Details
) {

    return function(config, syncher) {

        var that = this;

        that.list = [];

        _(config.layers).each(function(layerConfig) {
            if (layerConfig.type === 'currentLocation') {
                that.list.unshift(currentLocation);
                that.currentLocation = currentLocation;

            } else if (layerConfig.type === 'Data') {
                var dataLayer = Data.doNew(layerConfig, syncher).layer;
                that.list.unshift(dataLayer);
                that.data = dataLayer;

            } else if (layerConfig.type === 'VectorFiltered') {
                that.list.unshift(VectorFiltered.doNew(layerConfig.options).layer);

            } else if (layerConfig.type === 'VicmapLabelClassic') {
                that.list.unshift(VicmapLabelClassic.doNew().layer);

            } else if (layerConfig.type === 'VicmapClassic') {
                that.list.unshift(VicmapClassic.doNew().layer);

            } else if (layerConfig.type === 'OpenStreetMap') {
                that.list.unshift(OpenLayers.Layer.OSM.doNew("OpenStreetMap", null, { transitionEffect: 'resize' }));

            } else if (layerConfig.type === 'BingRoad') {
                that.list.unshift(Bing.doNew("Road", layerConfig.options.bingApiKey).layer);

            } else if (layerConfig.type === 'BingAerialWithLabels') {
                that.list.unshift(Bing.doNew("AerialWithLabels", layerConfig.options.bingApiKey).layer);

            } else {
                throw Error("Invalid layer type '"+layerConfig.type+"'");
            }
        });

        that.newAt = function(centerInWGS84) {
            that.data.newAt(centerInWGS84);
        };

    };

});

