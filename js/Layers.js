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

        this.list = [];

        switch (config.data().basemap) {

            case "OpenStreetMap":
                this.list.push(OpenLayers.Layer.OSM.doNew("OpenStreetMap", null, { transitionEffect: 'resize' }));
                break;

            case "BingRoad":
                this.list.push(Bing.doNew("Road").layer);
                break;

            case "BingAerialWithLabels":
                this.list.push(Bing.doNew("AerialWithLabels").layer);
                break;

            default:
                var vicmaps = Vicmaps.doNew();
                this.list.push(vicmaps.classic);
                this.list.push(vicmaps.labelClassic);
                break;

        }

        this.list.push(currentLocation);
        this.list.push(data);

        this.currentLocation = currentLocation;
        this.data = data;

    };

});

