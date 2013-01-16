define(["openlayers"], function(OpenLayers) {

    // API key for http://openlayers.org. Please get your own at http://bingmapsportal.com/ and use that instead.
    var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

    return [
        new OpenLayers.Layer.Bing({
            key: apiKey,
            type: "Road",
            name: "Bing Road",
            transitionEffect: 'resize'
        }),
        new OpenLayers.Layer.Bing({
            key: apiKey,
            type: "Aerial",
            name: "Bing Aerial",
            transitionEffect: 'resize'
        }),
        new OpenLayers.Layer.Bing({
            key: apiKey,
            type: "AerialWithLabels",
            name: "Bing Aerial + Labels",
            transitionEffect: 'resize'
        })
    ];

});

