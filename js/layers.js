define([
    "layers/data",
    "layers/bings",
    "layers/vicmaps",
    "layers/currentLocation"
], function(
    data,
    bings,
    vicmaps,
    currentLocation
) {

    var layers = [
        vicmaps.labelClassic,
        vicmaps.classic,
        bings.road,
        bings.aerial,
        bings.aerialWithLabels,
        new OpenLayers.Layer.OSM("OpenStreetMap", null, { transitionEffect: 'resize' }),
        currentLocation,
        data
    ];

    layers.currentLocation = currentLocation;
    layers.data = data;

    return layers;

});

