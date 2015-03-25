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
                    ],
                    // Based on OL2 example for client zoom
                    // Reference: http://dev.openlayers.org/releases/OpenLayers-2.13.1/examples/clientzoom.html
                    {
                        resolutions: [156543.03390625, 78271.516953125, 39135.7584765625,
                                      19567.87923828125, 9783.939619140625, 4891.9698095703125,
                                      2445.9849047851562, 1222.9924523925781, 611.4962261962891,
                                      305.74811309814453, 152.87405654907226, 76.43702827453613,
                                      38.218514137268066, 19.109257068634033, 9.554628534317017,
                                      4.777314267158508, 2.388657133579254, 1.194328566789627,
                                      0.5971642833948135, 0.25, 0.1],
                        serverResolutions: [156543.03390625, 78271.516953125, 39135.7584765625,
                                            19567.87923828125, 9783.939619140625,
                                            4891.9698095703125, 2445.9849047851562,
                                            1222.9924523925781, 611.4962261962891,
                                            305.74811309814453, 152.87405654907226,
                                            76.43702827453613, 38.218514137268066,
                                            19.109257068634033, 9.554628534317017,
                                            4.777314267158508, 2.388657133579254,
                                            1.194328566789627, 0.5971642833948135],
                        transitionEffect: 'resize'
                    }
                );
                break;

        }

    };

});

