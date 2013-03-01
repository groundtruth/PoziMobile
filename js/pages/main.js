define(["jquery", "PoziMap"], function($, PoziMap) {

    var result = {
        init: function() {
            window.map = new PoziMap();
            $("#zoomOut").click(function() { map.zoomOut(); });
            $("#seekToCurrentLocation").click(function() { map.seekToCurrentLocation(); });
            $("#zoomIn").click(function() { map.zoomIn(); });
        }
    };

    return result;

});
 
