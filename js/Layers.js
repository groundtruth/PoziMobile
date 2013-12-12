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

        var topDataLayer;

        _(config.layers.reverse()).each(function(layerConfig) {
            if (layerConfig.type === 'currentLocation') {
                that.list.push(currentLocation);
                that.currentLocation = currentLocation;

            } else if (layerConfig.type === 'Data') {
                var dataLayer = Data.doNew(layerConfig, syncher).layer;
                that.list.push(dataLayer);
                topDataLayer = dataLayer;

            } else if (layerConfig.type === 'VectorFiltered') {
                that.list.push(VectorFiltered.doNew(layerConfig.options).layer);

            } else if (layerConfig.type === 'VicmapLabelClassic') {
                that.list.push(VicmapLabelClassic.doNew().layer);

            } else if (layerConfig.type === 'VicmapClassic') {
                that.list.push(VicmapClassic.doNew().layer);

            } else if (layerConfig.type === 'OpenStreetMap') {
                that.list.push(OpenLayers.Layer.OSM.doNew("OpenStreetMap", null, { transitionEffect: 'resize' }));

            } else if (layerConfig.type === 'BingRoad') {
                if (!_(layerConfig.options).has('bingApiKey')) { throw Error('Bing API key requried!'); }
                that.list.push(Bing.doNew("Road", layerConfig.options.bingApiKey).layer);

            } else if (layerConfig.type === 'BingAerialWithLabels') {
                if (!_(layerConfig.options).has('bingApiKey')) { throw Error('Bing API key requried!'); }
                that.list.push(Bing.doNew("AerialWithLabels", layerConfig.options.bingApiKey).layer);

            } else {
                throw Error("Invalid layer type '"+layerConfig.type+"'");
            }
        });

        that.newAt = function(centerInWGS84) {
            topDataLayer.newAt(centerInWGS84);
        };

        that.refreshDataAround = function(centerInWGS84) {
            topDataLayer.getFeaturesAround(centerInWGS84);
        };

    };

});

