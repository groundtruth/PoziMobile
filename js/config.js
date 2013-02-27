define(["jquery"], function($) {

    var defaults = {
        defaultZoomLevel: 15,
        maxZoom: 18,
        featuresLimit: 20
    };

    return $.extend(defaults, {
        dataLayerName: "Minor Culverts",
        databaseName: "loddongis",
        readEndpoint: "http://v3.pozi.com/ws/rest/v3/ws_minor_culvert_geojson.php?callback=?",
        maxExtentBounds: [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
        centerLon: 15986928,
        centerLat: -4358362,
        POIFields: [
            
        ]
    });

});
 
