define([], function() {

    requirejs.config({
        urlArgs: "bust=" +  (new Date()).getTime(),
        paths: {
            "jasmine": "../lib/jasmine-1.3.1/jasmine",
            "jasmine-html": "../lib/jasmine-1.3.1/jasmine-html",
            "underscore": "../lib/underscore-1.4.3/underscore",
            "jquery": "../lib/jquery-1.8.3/jquery-1.8.3.min",
            "jquery.mobile": "../lib/jquery.mobile-1.3.0/jquery.mobile-1.3.0.min",
            "openlayers": "../lib/openlayers-2.12/OpenLayers.mobile",
            "json": "../lib/JSON-js/json2",
        },
        shim: {
            "jasmine": { exports: "jasmine" },
            "jasmine-html": { deps: ["jasmine"], exports: "jasmine" },
            "underscore": { exports: "_" },
            "openlayers": { exports: "OpenLayers" },
            "json": { exports: "JSON" }
        }
    });

});

