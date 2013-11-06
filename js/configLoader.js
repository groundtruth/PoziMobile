define(["underscore", "js/appId"], function(_, appId) {

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

    var result = {

        load: function(callback) {
            var configURL = appId.doNew(window.location.href).configURL();
            require(["text!"+configURL], function(configJSON) {
                var config = _.defaults(JSON.parse(configJSON), defaults);
                callback(config);
            });
        }

    };

    return result;

});

