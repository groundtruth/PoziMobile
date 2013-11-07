define(["openlayers"], function(OpenLayers) {

    return function(kind, bingApiKey) {

        switch (kind) {

            case "AerialWithLabels":
                this.layer = OpenLayers.Layer.Bing.doNew({
                    key: bingApiKey, // note: a trial key will generate erorrs "Uncaught TypeError: Cannot read property 'resources' of undefined"
                    type: "AerialWithLabels",
                    name: "Bing Aerial + Labels",
                    transitionEffect: 'resize'
                });
                break;

            default:
                this.layer = OpenLayers.Layer.Bing.doNew({
                    key: bingApiKey, // note: a trial key will generate erorrs "Uncaught TypeError: Cannot read property 'resources' of undefined"
                    type: "Road",
                    name: "Bing Road",
                    transitionEffect: 'resize'
                });
                break;

        }

    };

});

