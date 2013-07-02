define([
    "config",
    "layers/Bing",
    "layers/Vicmaps",
    "layers/VectorRoads",
    "layers/currentLocation",
    "layers/data"
], function(
    config,
    Bing,
    Vicmaps,
    VectorRoads,
    currentLocation,
    data
) {

    return function() {

        this.list = [];

        this.list.push(OpenLayers.Layer.Vector.doNew("Null Basemap", { isBaseLayer: true }));

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

        if (config.data().showVectorRoads) {
            this.list.push(VectorRoads.doNew(config.data().lga.toString()).layer);
        }

        this.list.push(currentLocation);
        this.list.push(data);

        this.currentLocation = currentLocation;
        this.data = data;

    };

});

