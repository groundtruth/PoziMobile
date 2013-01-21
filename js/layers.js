define([
    "layers/data",
    "layers/bings",
    "layers/vicmaps",
    "layers/currentPosition"
], function(
    data,
    bings,
    vicmaps,
    currentPosition
) {

    var layers = [
        vicmaps.labelClassic,
        vicmaps.classic,
        bings.road,
        bings.aerial,
        bings.aerialWithLabels,
        new OpenLayers.Layer.OSM("OpenStreetMap", null, { transitionEffect: 'resize' }),
        currentPosition,
        data
    ];

    layers.currentPosition = currentPosition;
    layers.data = data;

    return layers;

});

