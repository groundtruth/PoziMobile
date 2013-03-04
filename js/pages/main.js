define(["jquery", "PoziMap", "proj", "pages/details"], function($, PoziMap, proj, details) {

    var result = {
        init: function() {
            window.map = new PoziMap();
            $("#zoomOut").click(function() { map.zoomOut(); });
            $("#seekToCurrentLocation").click(function() { map.seekToCurrentLocation(); });
            $("#zoomIn").click(function() { map.zoomIn(); });
            $("#newButton").click(function() { details.new(map.getCenterInWGS84()).changeTo(); });
        }
    };

    return result;

});
 
