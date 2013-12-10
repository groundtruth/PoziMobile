define([
    "js/layers/Bing",
    "js/layers/Vicmaps",
    "js/layers/VectorRoads",
    "js/layers/VectorAddresses",
    "js/layers/VectorProperties",
    "js/layers/VectorCasements",
    "js/layers/currentLocation",
    "js/layers/data"
], function(
    Bing,
    Vicmaps,
    VectorRoads,
    VectorAddresses,
    VectorProperties,
    VectorCasements,
    currentLocation,
    data
) {

    return function(config, detailsPage) {

        this.list = [];

        if (config.showVectorCasements) {
            this.list.push(VectorCasements.doNew(config.lga).layer);
        }

        if (config.showVectorProperties) {
            this.list.push(VectorProperties.doNew(config.lga).layer);
        }

        if (config.showVectorRoads) {
            this.list.push(VectorRoads.doNew(config.lga).layer);
        }

        if (config.showVectorAddresses) {
            this.list.push(VectorAddresses.doNew(config.lga).layer);
        }

        this.list.push(currentLocation);
        var dataLayer = data.doNew(config, detailsPage).layer;
        this.list.push(dataLayer);

        switch (config.basemap) {

            case "OpenStreetMap":
                this.list.unshift(OpenLayers.Layer.OSM.doNew("OpenStreetMap", null, { transitionEffect: 'resize' }));
                break;

            case "BingRoad":
                this.list.unshift(Bing.doNew("Road", config.bingApiKey).layer);
                break;

            case "BingAerialWithLabels":
                this.list.unshift(Bing.doNew("AerialWithLabels", config.bingApiKey).layer);
                break;

            default:
                var vicmaps = Vicmaps.doNew();
                this.list.unshift(vicmaps.classic);
                this.list.push(vicmaps.labelClassic); // on top, for readability in offline mode
                break;

        }

        this.currentLocation = currentLocation;
        this.data = dataLayer;

    };

});

