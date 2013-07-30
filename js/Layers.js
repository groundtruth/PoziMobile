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
        var displayVicmapLabels = false;
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
                displayVicmapLabels = true;
                break;

        }

        // Offline layers
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

        // Placing the label layer on top for better readibility when offline
        if (displayVicmapLabels)
        {
            this.list.push(vicmaps.labelClassic);
        }

        this.list.push(currentLocation);
        this.list.push(data);

        this.currentLocation = currentLocation;
        this.data = data;

    };

});

