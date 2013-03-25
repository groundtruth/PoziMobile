define(["jquery", "underscore"], function($, _) {

    var defaults = {
        "defaultZoomLevel": 15,
        "maxZoom": 18,
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
            if (matches = href.match(/^http:\/\/([^\.]+)/)) { client = matches[1]; }
            if (matches = href.match(/^\w+:\/\/[^\/]+\/m\/([^\/]+)\//)) { appName = matches[1]; }
            fileNameBase = _([client, appName]).compact().join("-");
            return "config/" + fileNameBase + ".json";
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
 
