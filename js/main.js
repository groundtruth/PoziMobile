
requirejs.config({
    urlArgs: "bust=" +  (new Date()).getTime(),
    paths: {
        "underscore": "lib/underscore-1.4.2/underscore",
        "jquery": "lib/jquery-1.8.3/jquery-1.8.3.min",
        "openlayers": "lib/openlayers-2.12/OpenLayers.mobile",
    },
    shim: {
        "underscore": { exports: "_" },
        "openlayers": { exports: "OpenLayers" }
    }
});

require(["jquery", "initMap"], function($, initMap) {

    $(document).ready(function(){
        $("#map").height($("body").height());
        $("#map").width($("body").width());
        initMap();
    });

});

