define(["openlayers", "js/config"], function(OpenLayers, config) {

    return function(kind) {

        switch (kind) {

            case "AerialWithLabels":
                this.layer = OpenLayers.Layer.Bing.doNew({
                    key: config.data().bingApiKey,
                    type: "AerialWithLabels",
                    name: "Bing Aerial + Labels",
                    transitionEffect: 'resize'
                });
                break;

            default:
                this.layer = OpenLayers.Layer.Bing.doNew({
                    key: config.data().bingApiKey,
                    type: "Road",
                    name: "Bing Road",
                    transitionEffect: 'resize'
                });
                break;

        }

    };

});

