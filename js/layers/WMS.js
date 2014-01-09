define(["openlayers", "js/proj"], function(OpenLayers, proj) {

    return function(options) {
        var that = this;

        this.layer = OpenLayers.Layer.WMS.doNew(options.name, options.url, options.params, options.options);

    };

});

