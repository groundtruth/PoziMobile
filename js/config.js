define(["jquery", "underscore"], function($, _) {

    var defaults = {
        "defaultZoomLevel": 18,
        "maxZoom": 19,
        "featuresLimit": 20,
        "genericDetailsFields": [
            {
                "type": "hidden",
                "id": "lat"
            },
            {
                "type": "hidden",
                "id": "lon"
            },
            {
                "type": "hidden",
                "id": "config",
                "value": "loddongis"
            },
            {
                "type": "hidden",
                "id": "id",
                "value": ""
            }
        ]
    };

    var config;

    return {

        configURL: function(href) {
            var client, appName, matches, fileNameBase;
            if (matches = href.match(/^\w+:\/\/([a-z\-]+)/i)) { client = matches[1]; }
            if (matches = href.match(/^\w+:\/\/[^\/]+\/m\/([^\/]+)\//)) { appName = matches[1]; }

            // override with URL parameters if available, to support development on localhost
            var getParameterByName = function(name) {
                var match = RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
                return match && decodeURIComponent(match[1].replace(/\+/g, " "));
            }
            client = getParameterByName("client") || client;
            appName = getParameterByName("appName") || appName;

            fileNameBase = _([client, appName]).compact().join("-");
            if (fileNameBase.length > 1) {
                return "config/" + fileNameBase + ".json";
            } else {
                return "config/demo-mc.json";
            }
        },

        fetchConfig: function() {
            var url = this.configURL(window.location.href);
            return $.parseJSON(
                $.ajax({
                    type: 'GET',
                    url: url,
                    dataType: 'json',
                    success: function() { },
                    data: {},
                    async: false
                }).responseText
            );
        },

        forgetConfig: function() { config = undefined; },

        data: function() {
            if (typeof config === "undefined") {
                return config = $.extend(defaults, this.fetchConfig());
            } else {
                return config;
            }
        }

    };

});
 
