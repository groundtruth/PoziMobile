define(["openlayers", "proj", "PoziGeolocate", "layers"], function(OpenLayers, proj, PoziGeolocate, layers) {

    var PoziMap = function() {

        OpenLayers.Map.call(this, {
            div: "map",
            theme: null,
            projection: proj.sphericalMercator,
            units: "m",
            numZoomLevels: 20,
            maxResolution: 156543.0339,
            maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
            controls: [
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.TouchNavigation({
                    dragPanOptions: {
                        interval: 100,
                        enableKinetic: true
                    }
                })
            ],
            // center: new OpenLayers.LonLat(16061635, -4405394),
            center: new OpenLayers.LonLat(16061608, -4405233),
            zoom: 15
        });

        this.getCenterInWebMercator = function() {
            return this.getCenter().transform(proj.sphericalMercator, proj.webMarcator);
        };

        this.setCenterAndZoomToExtent = function(locationInSpherical, extent) {
            var zoomWithinLimit = Math.min(this.getZoomForExtent(extent), 18);
            this.setCenter(locationInSperhical, zoomWithinLimit);
        };

        this.addLayers(layers);

        this.addControls([
            new PoziGeolocate(this, layers.currentPosition),
            new OpenLayers.Control.SelectFeature(layers.data, {
                autoActivate: true,
                onSelect: function(feature) {
                    alert("onSelectFeatureFunction is not implemented!");
                    // var clickedFeature = feature;
                    // if (!app.captureUpdateFormPopupPanel) {
                    //     app.captureUpdateFormPopupPanel = new App.CaptureUpdateFormPopupPanel();
                    // } else {
                    //     // Updating the lat / lon values in the existing form
                    //     app.captureUpdateFormPopupPanel.setFeature(clickedFeature);
                    // }
                    // app.captureUpdateFormPopupPanel.show('pop');
                }
            })
        ]);

        this.events.register('moveend', this, function() { layers.data.getFeaturesAround(this.getCenterInWebMercator()); });
        
        layers.data.getFeaturesAround(this.getCenterInWebMercator());
    };

    PoziMap.prototype = new OpenLayers.Map();

    return PoziMap;

});
  

