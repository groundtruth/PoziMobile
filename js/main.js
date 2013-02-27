
requirejs.config({
    urlArgs: "bust=" +  (new Date()).getTime(),
    paths: {
        "underscore": "../lib/underscore-1.4.3/underscore",
        "jquery": "../lib/jquery-1.8.3/jquery-1.8.3.min",
        "jquery.mobile": "../lib/jquery.mobile-1.3.0/jquery.mobile-1.3.0.min",
        "openlayers": "../lib/openlayers-2.12/OpenLayers.mobile",
        "json": "../lib/JSON-js/json2",
    },
    shim: {
        "underscore": { exports: "_" },
        "openlayers": { exports: "OpenLayers" },
        "json": { exports: "JSON" }
    }
});

require(["jquery", "pages"], function($, pages) {
    $(document).ready(function(){ pages.initAll(); });
});

