define(["openlayers", "config"], function(OpenLayers, config) {

    return {

        road: OpenLayers.Layer.Bing.doNew({
            key: config.data().bingApiKey,
            type: "Road",
            name: "Bing Road",
            transitionEffect: 'resize'
        }),

        aerial: OpenLayers.Layer.Bing.doNew({
            key: config.data().bingApiKey,
            type: "Aerial",
            name: "Bing Aerial",
            transitionEffect: 'resize'
        }),

        aerialWithLabels: OpenLayers.Layer.Bing.doNew({
            key: config.data().bingApiKey,
            type: "AerialWithLabels",
            name: "Bing Aerial + Labels",
            transitionEffect: 'resize'
        })

    };

});

