define(["jquery", "PoziMap", "proj"], function($, PoziMap, proj) {
    var details;
    var $page = $("#pageMain");

    var result = {
        init: function(detailsPage) {
            details = detailsPage;
            window.map = new PoziMap();
            $page.on("pagebeforeshow", function() { map.updateData(); });
            $("#zoomOut").click(function() { map.zoomOut(); });
            $("#seekToCurrentLocation").click(function() { map.seekToCurrentLocation(); });
            $("#zoomIn").click(function() { map.zoomIn(); });
            $("#newButton").click(function() { details.new(map.getCenterInWGS84()).changeTo(); });
        },

        setSyncButton: function(icon, number) {
            var newButton = '<button id="syncButton" class="ui-btn-left" data-icon="'+icon+'">'+number+'</button>';
            $("#syncButton").closest("div").remove();
            $page.find("header").prepend(newButton).trigger("create");
        }
    };

    return result;
});
 
