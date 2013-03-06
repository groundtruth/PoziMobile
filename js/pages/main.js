define(["jquery", "PoziMap", "proj", "pages/details"], function($, PoziMap, proj, details) {
    var $page = $("#pageMain");

    var result = {
        init: function() {
            window.map = new PoziMap();
            $("#toSyncButton").closest("div").hide();
            $page.on("pagebeforeshow", function() { map.updateData(); });
            $("#zoomOut").click(function() { map.zoomOut(); });
            $("#seekToCurrentLocation").click(function() { map.seekToCurrentLocation(); });
            $("#zoomIn").click(function() { map.zoomIn(); });
            $("#newButton").click(function() { details.new(map.getCenterInWGS84()).changeTo(); });
        }
    };

    return result;

});
 
