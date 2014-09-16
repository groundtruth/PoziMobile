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

        this.showMapAt = function(bounds) {
            $.mobile.changePage($page, { transition: "none" });
            map.zoomToExtent(bounds);
        };

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

        var loginRequired = opts.config.hasOwnProperty('loginHTML');
        if (loginRequired)
        {
            $page.prepend('<div id="login" data-role="popup" data-dismissible="false" data-overlay-theme="b" data-transition="none"><iframe src=\''+opts.config.loginHTML+'\' width=\'300\' height=\'200\' scrolling=\'no\'></div>').trigger("create");
            $('#login').popup('open');
        }

        if (opts.config.hasOwnProperty('detailsPageTitle'))
        {
            // Setting a title in the header of the details page
            $("#pageDetails h1").html(opts.config.detailsPageTitle);
        }

        if (opts.config.hasOwnProperty('infoHTML')) {
            var infoHTML = require('text!'+opts.config.infoHTML);
            $page.prepend('<div id="info" data-role="popup"><p>'+infoHTML+'</p></div>').trigger("create");
            $page.find('footer').prepend('<button id="infoButton" data-transition="none" data-icon="info" data-iconpos="notext" class="ui-btn-left" data-rel="popup">Info</button>').trigger("create");
            $("#infoButton").click(function() { $('div#info').popup('open'); });
        }

        if (opts.config.hasOwnProperty('search')) {
            $page.find('footer').append('<button id="searchButton" data-transition="none" data-icon="search" data-iconpos="notext" class="ui-btn-right" data-rel="popup">Search</button>').trigger("create");
            $("#searchButton").click(function() {
                opts.pages.openSearch();
            });
        }

    };

});

