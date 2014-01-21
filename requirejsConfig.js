define([], function() {

    requirejs.config({
        urlArgs: "bust=" +  (new Date()).getTime(),
        paths: {
            "text": "vendor/requirejs-text-2.0.10/text",
            "jasmine-jquery": "vendor/jasmine-jquery/jasmine-jquery",
            "Squire": "vendor/squire-24dfa9/Squire",
            "underscore": "vendor/underscore-1.4.3/underscore",
            "jquery": "vendor/jquery-1.8.3/jquery-1.8.3.min",
            "jquery.mobile": "vendor/jquery.mobile-1.3.0/jquery.mobile-1.3.0.min",
            "openlayers": "vendor/openlayers-2.13.1/OpenLayers.mobile",
            "openlayers.rule": "vendor/openlayers-2.13.1/OpenLayers.Rule",
            "openlayers.handler.box": "vendor/openlayers-2.13.1/OpenLayers.Handler.Box",
            "openlayers.control.zoombox": "vendor/openlayers-2.13.1/OpenLayers.Control.ZoomBox",
            "openlayers.handler.mousewheel": "vendor/openlayers-2.13.1/OpenLayers.Handler.MouseWheel",
            "openlayers.control.navigation": "vendor/openlayers-2.13.1/OpenLayers.Control.Navigation",
            "mustache": "vendor/mustache-0.7.2/mustache",
            "jsonpath": "vendor/jsonpath/jsonpath-0.8.0"
        },
        shim: {
            "jasmine-jquery": { deps: ["jquery"], exports: "jasmine" },
            "underscore": { exports: "_" },
            "openlayers": { exports: "OpenLayers" },
            "openlayers.rule": { deps: ["openlayers"], exports: "OpenLayers" },
            "openlayers.handler.box": { deps: ["openlayers"], exports: "OpenLayers" },
            "openlayers.control.zoombox": { deps: ["openlayers", "openlayers.handler.box"], exports: "OpenLayers" },
            "openlayers.handler.mousewheel": { deps: ["openlayers"], exports: "OpenLayers" },
            "openlayers.control.navigation": { deps: ["openlayers", "openlayers.control.zoombox", "openlayers.handler.mousewheel"], exports: "OpenLayers" },
            "jsonpath": { exports: "jsonPath" }
        },
        callback: function($) {
            // CREATE A METHOD TO WRAP THE PROCESS OF OBJECT CONSTRUCTION
            //   avoiding direct use of the 'new' keyword means tests can stub/mock
            //   constructors without needing them in the global namespace
            Function.prototype.doNew = function(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
                if (arguments.length > 10) { throw new Error("doNew constructor wrapper can only handle up to 10 arguments"); }
                return(new this(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10));
            };
        }
    });

});

