define([
    "config",
    "layers/Bing",
    "layers/Vicmaps",
    "layers/VectorRoads",
    "layers/VectorAddresses",
    "layers/VectorProperties",
    "layers/VectorCasements",
    "layers/currentLocation",
    "layers/data"
], function(
    config,
    Bing,
    Vicmaps,
    VectorRoads,
    VectorAddresses,
    VectorProperties,
    VectorCasements,
    currentLocation,
    data
) {

    return function() {

        this.list = [];

        if (config.data().showVectorCasements) {
            this.list.push(VectorCasements.doNew(config.data().lga).layer);
        }

        if (config.data().showVectorProperties) {
            this.list.push(VectorProperties.doNew(config.data().lga).layer);
        }

        if (config.data().showVectorRoads) {
            this.list.push(VectorRoads.doNew(config.data().lga).layer);
        }

        if (config.data().showVectorAddresses) {
            this.list.push(VectorAddresses.doNew(config.data().lga).layer);
        }

        this.list.push(currentLocation);
        this.list.push(data);

        switch (config.data().basemap) {

            case "OpenStreetMap":
                this.list.unshift(OpenLayers.Layer.OSM.doNew("OpenStreetMap", null, { transitionEffect: 'resize' }));
                break;

            case "BingRoad":
                this.list.unshift(Bing.doNew("Road").layer);
                break;

            case "BingAerialWithLabels":
                this.list.unshift(Bing.doNew("AerialWithLabels").layer);
                break;

            default:
                var vicmaps = Vicmaps.doNew();
                this.list.unshift(vicmaps.classic);
                this.list.push(vicmaps.labelClassic); // on top, for readability in offline mode
                break;

        }

        this.currentLocation = currentLocation;
        this.data = data;

    };

});

