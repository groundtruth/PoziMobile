define(["jquery", "js/PoziMap", "js/proj"], function($, PoziMap, proj) {

    return function(opts) {
        var that = this;

        this.updateData = function() { map.updateData(); };

        this.setSyncButton = function(icon, number) {
            var newButton = '<button id="syncButton" class="ui-btn-left" data-icon="'+icon+'">'+number+'</button>';
            $("#syncButton").closest("div").remove();
            $page.find("header").prepend(newButton).trigger("create");
        };

        this.toggleFollowLocation = function(button) {
            if (map.isFollowingLocation()) {
                button.classList.remove("ui-btn-on-a");
                map.stopFollowingLocation();
            } else {
                button.classList.add("ui-btn-on-a");
                map.startFollowingLocation();
            }
        };

        var $page = $("#pageMain");
        var details = opts.details;
        var syncher = opts.syncher;
        var map = PoziMap.doNew(details);

        this.setSyncButton("check", "&nbsp;");

        $page.on("pagebeforeshow", function() { that.updateData(); });

        $("#syncButton").live("click", function() { syncher.processQueue(true); });
        $("#zoomOut").click(function() { map.zoomOut(); });
        $("#followLocation").click(function() { that.toggleFollowLocation(this); });
        $("#zoomIn").click(function() { map.zoomIn(); });
        $("#newButton").click(function() { details.new(map.getCenterInWGS84()).changeTo(); });

    };

});
 
