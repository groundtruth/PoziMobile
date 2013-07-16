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
            // Support for development on a localhost server e.g. Tomcat
            if (matches = href.match(/^\w+:\/\/localhost.*/))
            {
                var getURLParameter = function (name) {
                    return decodeURI(
                        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
                    );
                }
                client = getURLParameter('client');
                appName = getURLParameter('appName');
            }
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
 
