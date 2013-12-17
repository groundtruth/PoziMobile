define(["jquery", "js/PoziMap", "js/proj", "js/Layers"], function($, PoziMap, proj, Layers) {

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

        var layers = Layers.doNew(opts.config, opts.syncher);
        var map = PoziMap.doNew(opts.config, layers);

        this.setSyncButton("check", "&nbsp;");

        $page.on("pagebeforeshow", function() { that.updateData(); });

        $("#syncButton").live("click", function() { opts.syncher.processQueue(true); });
        $("#zoomOut").click(function() { map.zoomOut(); });
        $("#followLocation").click(function() { that.toggleFollowLocation(this); });
        $("#zoomIn").click(function() { map.zoomIn(); });

        if (layers.newFeaturesHandled()) {
            $("#newButton").click(function() { layers.newAt(map.getCenterInWGS84()); });
        } else {
            $("#newButton").parent().hide();
        }

    };

});

