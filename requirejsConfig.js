define([], function() {

    requirejs.config({
        urlArgs: "bust=" +  (new Date()).getTime(),
        paths: {
            "jasmine-jquery": "lib/jasmine-jquery/jasmine-jquery",
            "underscore": "lib/underscore-1.4.3/underscore",
            "jquery": "lib/jquery-1.8.3/jquery-1.8.3.min",
            "jquery.mobile": "lib/jquery.mobile-1.3.0/jquery.mobile-1.3.0.min",
            "openlayers": "lib/openlayers-2.12/OpenLayers.mobile",
            "mustache": "lib/mustache-0.7.2/mustache",
            // "json": "lib/JSON-js/json2"
        },
        shim: {
            "jasmine-jquery": { deps: ["jquery"], exports: "jasmine" },
            "underscore": { exports: "_" },
            "openlayers": { exports: "OpenLayers" }
            // "json": { exports: "JSON" }
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
