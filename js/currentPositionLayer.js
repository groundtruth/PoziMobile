define(["openlayers"], function(OpenLayers) {

    var currentPositionLayer = new OpenLayers.Layer.Vector("GPS position", {});
    return currentPositionLayer;

});

