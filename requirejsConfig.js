define([], function() {

    requirejs.config({
        urlArgs: "bust=" +  (new Date()).getTime(),
        paths: {
            "text": "vendor/requirejs-text-2.0.10/text",
            "jasmine-jquery": "vendor/jasmine-jquery/jasmine-jquery",
            "Squire": "vendor/squire-24dfa9/Squire",
            "underscore": "vendor/underscore-1.4.3/underscore",
            "jquery": "vendor/jquery-1.12.0.min",
            "jquery.mobile": "vendor/jquery.mobile-1.3.0/jquery.mobile-1.3.0.min",
            "openlayers": "vendor/openlayers-2.13.1/OpenLayers.mobile",
            "openlayers.rule": "vendor/openlayers-2.13.1/OpenLayers.Rule",
            "mustache": "vendor/mustache-0.7.2/mustache",
            "jsonpath": "vendor/jsonpath/jsonpath-0.8.0"
        },
        shim: {
            "jasmine-jquery": { deps: ["jquery"], exports: "jasmine" },
            "underscore": { exports: "_" },
            "openlayers": { exports: "OpenLayers" },
            "openlayers.rule": { exports: "OpenLayers" },
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

