define(["openlayers", "proj", "PoziGeolocate", "layers"], function(OpenLayers, proj, PoziGeolocate, layers) {

    var PoziMap = function() {
        var defaultZoomLevel = 15;

        OpenLayers.Map.call(this, {
            div: "map",
            theme: null,
            projection: proj.webMercator,
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
            center: new OpenLayers.LonLat(16061608, -4405233)
        });

        this.getCenterInWGS84 = function() {
            return this.getCenter().transform(proj.webMercator, proj.WGS84);
        };

        this.setCenterAndZoomToExtent = function(locationInSpherical, extent) {
            var zoomWithinLimit = Math.min(this.getZoomForExtent(extent), 18);
            this.setCenter(locationInSperhical, zoomWithinLimit);
        };

        this.seekToCurrentLocation = function() {
            var geolocate = this.getControlsBy("id", "locate-control")[0];
            if (geolocate.active) {
              geolocate.getCurrentLocation();
            } else {
              geolocate.activate();
            }
        };

        this.addLayers(layers);

        this.addControls([
            new PoziGeolocate(this, layers.currentLocation),
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

        this.events.register('moveend', this, function() { layers.data.getFeaturesAround(this.getCenterInWGS84()); });

        this.zoomTo(defaultZoomLevel);
        
        layers.data.getFeaturesAround(this.getCenterInWGS84());
        
    };

    PoziMap.prototype = new OpenLayers.Map();

    return PoziMap;

});
  

