
requirejs.config({
    urlArgs: "bust=" +  (new Date()).getTime(),
    paths: {
        "underscore": "../lib/underscore-1.4.3/underscore",
        "jquery": "../lib/jquery-1.8.3/jquery-1.8.3.min",
        "jquery.mobile": "../lib/jquery.mobile-1.2.0/jquery.mobile-1.2.0.min",
        "openlayers": "../lib/openlayers-2.12/OpenLayers.mobile",
    },
    shim: {
        "underscore": { exports: "_" },
        "openlayers": { exports: "OpenLayers" }
    }
});

require(["jquery", "jquery.mobile", "PoziMap"], function($, jm, PoziMap) {

    $(document).ready(function(){
        $("#map").height($(window).height()-2*40);
        $("#map").width($(window).width());
        
        window.map = new PoziMap();
 
        $("#zoomOut").click(function() { map.zoomOut(); });
    });

});

