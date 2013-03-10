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
        OpenLayers.Layer.OSM.doNew("OpenStreetMap", null, { transitionEffect: 'resize' }),
        currentLocation,
        data
    ];

    layers.currentLocation = currentLocation;
    layers.data = data;

    return layers;

});

