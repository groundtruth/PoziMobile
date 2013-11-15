define(["underscore", "js/appId"], function(_, appId) {

    var defaults = {
        "defaultTestKey": "defaultTestValue",
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
            }
        ]
    };

    var result = {

        load: function(callback) {
            var configURL = appId.doNew(window.location.href).configURL();
            require(["text!"+configURL], function(configJSON) {
                var config = _.defaults(JSON.parse(configJSON), defaults);
                var extraScripts = _.union(
                    _(config.prePopulators).toArray(),
                    _(config.onSaves).toArray()
                );
                require(extraScripts, function() {
                    callback(config);
                });
            });
        }

    };

    return result;

});

