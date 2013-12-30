define(["underscore", "jsonpath", "js/appId"], function(_, jsonPath, appId) {

    var defaults = {
        "defaultTestKey": "defaultTestValue",
        "defaultZoomLevel": 18,
        "maxZoom": 19
    };

    var result = {

        load: function(callback) {
            var configURL = appId.doNew(window.location.href).configURL();
            require(["text!"+configURL], function(configJSON) {
                var config = _.defaults(JSON.parse(configJSON), defaults);
                var extraScripts = _.union(
                    _(jsonPath(config, '$..prePopulators')).chain().toArray().flatten().value(),
                    _(jsonPath(config, '$..onSaves')).chain().toArray().flatten().value(),
                    _(jsonPath(config, '$..styleRules')).chain().toArray().flatten().value(),
                    _(jsonPath(config, '$..infoHTML')).chain().toArray().flatten().map(function(url) { return 'text!'+url; }).value()
                );
                require(extraScripts, function() {
                    callback(config);
                });
            });
        }

    };

    return result;

});

