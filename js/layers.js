define([
    "config",
    "layers/Bing",
    "layers/Vicmaps",
    "layers/currentLocation",
    "layers/data"
], function(
    config,
    Bing,
    Vicmaps,
    currentLocation,
    data
) {

    var layers = [];

    switch (config.data().basemap) {

        case "OpenStreetMap":
            layers.push(OpenLayers.Layer.OSM.doNew("OpenStreetMap", null, { transitionEffect: 'resize' }));
            break;

        case "BingRoad":
            layers.push(Bing.doNew("Road"));
            break;

        case "BingAerialWithLabels":
            layers.push(Bing.doNew("AerialWithLabels"));
            break;

        default:
            var vicmaps = Vicmaps.doNew();
            layers.push(vicmaps.classic);
            layers.push(vicmaps.labelClassic);
            break;

    }

    layers.push(currentLocation);
    layers.push(data);

    layers.currentLocation = currentLocation;
    layers.data = data;

    return layers;

});

