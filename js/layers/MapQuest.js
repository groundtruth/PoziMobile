define(["openlayers"], function(OpenLayers) {

    // Reference: http://developer.mapquest.com/web/products/open/map

    return function(kind) {

        switch (kind) {

            case "Aerial":
                this.layer = OpenLayers.Layer.OSM.doNew(
                    "MapQuest Open Aerial",
                    [
                        "http://otile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg",
                        "http://otile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg",
                        "http://otile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg",
                        "http://otile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.jpg"
                    ]
                );
                break;

            default:
                this.layer = OpenLayers.Layer.OSM.doNew(
                    "MapQuest-OSM",
                    [
                        "http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg",
                        "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg",
                        "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg",
                        "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.jpg"
                    ]
                );
                break;

        }

    };

});

