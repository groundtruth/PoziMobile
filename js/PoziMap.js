define([
    "jquery",
    "openlayers",
    "proj",
    "PoziGeolocate",
    "layers",
    "pages/details"
], function(
    $,
    OpenLayers,
    proj,
    PoziGeolocate,
    layers,
    pageDetails
) {

    var PoziMap = function() {
        var defaultZoomLevel = 15;
        var that = this;

        this.getCenterInWGS84 = function() {
            return this.getCenter().transform(proj.webMercator, proj.WGS84);
        };

        this.setCenterAndZoomToExtent = function(locationInWebMercator, extent) {
            var zoomWithinLimit = Math.min(this.getZoomForExtent(extent), 18);
            this.setCenter(locationInWebMercator, zoomWithinLimit);
        };

        this.seekToCurrentLocation = function() {
            var geolocate = this.getControlsBy("id", "locate-control")[0];
            if (geolocate.active) {
              geolocate.getCurrentLocation();
            } else {
              geolocate.activate();
            }
        };

        this.setSize = function() {
            $("#map").height($(window).innerHeight()); // bigger than usual visible size accounts for scroll off of URL bar
            $("#map").width($(window).width());
        };

        $(window).resize(function() { that.setSize(); });
        $(window).orientationchange(function() { that.setSize(); });
        this.setSize();

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
            center: new OpenLayers.LonLat(15986928, -4358362)
        });

        this.addLayers(layers);

        this.addControls([
            new PoziGeolocate(this, layers.currentLocation),
            new OpenLayers.Control.SelectFeature(layers.data, {
                autoActivate: true,
                onSelect: function(feature) { pageDetails.dataInit(feature).changeTo(); }
            })
        ]);

        this.events.register('moveend', this, function() { layers.data.getFeaturesAround(this.getCenterInWGS84()); });

        this.zoomTo(defaultZoomLevel);

        layers.data.getFeaturesAround(this.getCenterInWGS84());
        
    };

    PoziMap.prototype = new OpenLayers.Map();
    return PoziMap;

});
  

