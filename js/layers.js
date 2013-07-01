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

    return function() {

        this.layers = [];

        switch (config.data().basemap) {

            case "OpenStreetMap":
                this.layers.push(OpenLayers.Layer.OSM.doNew("OpenStreetMap", null, { transitionEffect: 'resize' }));
                break;

            case "BingRoad":
                this.layers.push(Bing.doNew("Road").layer);
                break;

            case "BingAerialWithLabels":
                this.layers.push(Bing.doNew("AerialWithLabels").layer);
                break;

            default:
                var vicmaps = Vicmaps.doNew();
                this.layers.push(vicmaps.classic);
                this.layers.push(vicmaps.labelClassic);
                break;

        }

        this.layers.push(currentLocation);
        this.layers.push(data);

        this.layers.currentLocation = currentLocation;
        this.layers.data = data;

    };

});

