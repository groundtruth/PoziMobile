define([
    "underscore",
    "js/layers/Bing",
    "js/layers/VicmapAPI",
    "js/layers/VicmapClassic",
    "js/layers/VicmapLabelClassic",
    "js/layers/VectorFiltered",
    "js/layers/WMS",
    "js/layers/currentLocation",
    "js/layers/PointData",
    "js/layers/RecordOnPointData",
    "js/pages/Details"
], function(
    _,
    Bing,
    VicmapAPI,
    VicmapClassic,
    VicmapLabelClassic,
    VectorFiltered,
    WMS,
    currentLocation,
    PointData,
    RecordOnPointData,
    Details
) {

    return function(config, syncher) {

        var that = this;

        that.list = [];

        var dataLayers = [];
        var topDataLayer;

        _(config.layers.reverse()).each(function(layerConfig) {
            if (layerConfig.type === 'currentLocation') {
                that.list.push(currentLocation);
                that.currentLocation = currentLocation;

            } else if (layerConfig.type === 'PointData') {
                var dataLayer = PointData.doNew(layerConfig, syncher).layer;
                that.list.push(dataLayer);
                dataLayers.push(dataLayer);
                if (dataLayer.handlesNewFeatures()) { topDataLayer = dataLayer; }

            } else if (layerConfig.type === 'RecordOnPointData') {
                var dataLayer = RecordOnPointData.doNew(layerConfig, syncher).layer;
                that.list.push(dataLayer);
                dataLayers.push(dataLayer);
                if (dataLayer.handlesNewFeatures()) { topDataLayer = dataLayer; }

            } else if (layerConfig.type === 'VectorFiltered') {
                that.list.push(VectorFiltered.doNew(layerConfig.options).layer);

            } else if (layerConfig.type === 'WMS') {
                that.list.push(WMS.doNew(layerConfig.options).layer);

            } else if (layerConfig.type === 'VicmapAPI') {
                that.list.push(VicmapAPI.doNew().layer);

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

        that.newFeaturesHandled = function() {
            return !!topDataLayer;
        };

        that.newAt = function(centerInWGS84) {
            topDataLayer.newAt(centerInWGS84);
        };

        that.refreshDataAround = function(centerInWGS84) {
            _(dataLayers).each(function(layer) {
                layer.getFeaturesAround(centerInWGS84);
            });
        };

    };

});

