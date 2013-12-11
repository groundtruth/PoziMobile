define([
    "underscore",
    "js/layers/Bing",
    "js/layers/VicmapClassic",
    "js/layers/VicmapLabelClassic",
    "js/layers/VectorRoads",
    "js/layers/VectorAddresses",
    "js/layers/VectorProperties",
    "js/layers/VectorCasements",
    "js/layers/currentLocation",
    "js/layers/Data"
], function(
    _,
    Bing,
    VicmapClassic,
    VicmapLabelClassic,
    VectorRoads,
    VectorAddresses,
    VectorProperties,
    VectorCasements,
    currentLocation,
    Data
) {

    return function(config, detailsPage) {

        var that = this;

        that.list = [];

        _(config.layers).each(function(layerConfig) {
            if (layerConfig.type === 'currentLocation') {
                that.list.unshift(currentLocation);
                that.currentLocation = currentLocation;

            } else if (layerConfig.type === 'Data') {
                var dataLayer = Data.doNew(config, detailsPage).layer;
                that.list.unshift(dataLayer);
                that.data = dataLayer;

            } else if (layerConfig.type === 'VectorCasements') {
                that.list.unshift(VectorCasements.doNew(layerConfig.options.lga).layer);

            } else if (layerConfig.type === 'VectorProperties') {
                that.list.unshift(VectorProperties.doNew(layerConfig.options.lga).layer);

            } else if (layerConfig.type === 'VectorRoads') {
                that.list.unshift(VectorRoads.doNew(layerConfig.options.lga).layer);

            } else if (layerConfig.type === 'VectorAddresses') {
                that.list.unshift(VectorAddresses.doNew(layerConfig.options.lga).layer);

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

    };

});

