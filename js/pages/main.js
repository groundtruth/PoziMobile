define(["jquery", "PoziMap", "proj"], function($, PoziMap, proj) {
    var details, syncher;
    var $page = $("#pageMain");

    var result = {
        init: function(opts) {
            details = opts.details;
            syncher = opts.syncher;
            window.map = new PoziMap();
            $page.on("pagebeforeshow", function() { map.updateData(); });
            this.setSyncButton("check", "&nbsp;");
            $("#syncButton").live("click", function() { syncher.processQueue(true); });
            $("#zoomOut").click(function() { map.zoomOut(); });
            $("#seekToCurrentLocation").click(function() { map.seekToCurrentLocation(); });
            $("#zoomIn").click(function() { map.zoomIn(); });
            $("#newButton").click(function() { details.new(map.getCenterInWGS84()).changeTo(); });
        },

        setSyncButton: function(icon, number) {
            var newButton = '<button id="syncButton" class="ui-btn-left" data-icon="'+icon+'">'+number+'</button>';
            $("#syncButton").closest("div").remove();
            $page.find("header").prepend(newButton).trigger("create");
        },

        updateData: function() { map.updateData(); }

    };

    return result;
});
 
