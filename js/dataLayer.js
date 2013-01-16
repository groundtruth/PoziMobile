define(["openlayers"], function(OpenLayers) {

    // The style hardcodes the correspondance between a status code and the external graphic name
    // We tried with adduniquerules but OpenLayers.Rule does not seem defined in Openlayers mobile
    return new OpenLayers.Layer.Vector("Fire Hazards", {
        styleMap: new OpenLayers.StyleMap({
            externalGraphic: "img/mobile-loc-${haz_status}.png",
            graphicOpacity: 1.0,
            graphicWith: 16,
            graphicHeight: 26,
            graphicYOffset: -26
        })
    });

});

