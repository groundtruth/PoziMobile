define(["jquery", "underscore", "js/appId"], function($, _, appId) {

    var defaults = {
        "idField": "id",
        "defaultZoomLevel": 18,
        "maxZoom": 19,
        "iconFile": "img/mobile-loc-1.png",
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
                "id": "id",
                "value": ""
            }
        ]
    };

    var config;

    return {

        fetchConfig: function() {
            var url = appId.doNew(window.location.href).configURL();
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

