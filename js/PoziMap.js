define([
    "jquery",
    "openlayers",
    "proj",
    "PoziGeolocate",
    "layers",
    "config"
], function(
    $,
    OpenLayers,
    proj,
    PoziGeolocate,
    layers,
    config
) {

    var PoziMap = function(detailsPage) {
        var defaultZoomLevel = config.defaultZoomLevel;
        var that = this;

        this.getCenterInWGS84 = function() {
            return this.getCenter().transform(proj.webMercator, proj.WGS84);
        };

        this.setCenterAndZoomToExtent = function(locationInWebMercator, extent) {
            var zoomWithinLimit = Math.min(this.getZoomForExtent(extent), config.maxZoom);
            this.setCenter(locationInWebMercator, zoomWithinLimit);
        };

        this.seekToCurrentLocation = function() {
            var geolocate = this.getControlsBy("id", "locate-control")[0];
            layers.currentLocation.clearLocationMarker();
            if (geolocate.active) {
              geolocate.getCurrentLocation();
            } else {
              geolocate.activate();
            }
        };

        this.setSize = function() {
            // this height is full window, behind header/footer - allows for scroll off of URL bar on mobile
            // -1 adjustment so rounding errors don't create a scrollable area
            $("#map").height($(window).innerHeight() - 1);
            $("#map").width($(window).width());
        };

        $(window).resize(function() { that.setSize(); });
        $(window).orientationchange(function() { that.setSize(); });
        this.setSize();

        this.updateData = function() {
            layers.data.getFeaturesAround(this.getCenterInWGS84());
        };

        OpenLayers.Map.call(this, {
            div: "map",
            theme: null,
            projection: proj.webMercator,
            units: "m",
            numZoomLevels: 20,
            maxResolution: 156543.0339,
            maxExtent: OpenLayers.Bounds.doNew(
                config.maxExtentBounds[0],
                config.maxExtentBounds[1],
                config.maxExtentBounds[2],
                config.maxExtentBounds[3]
            ),
            controls: [
                OpenLayers.Control.Attribution.doNew(),
                OpenLayers.Control.TouchNavigation.doNew({
                    dragPanOptions: {
                        interval: 100,
                        enableKinetic: true
                    }
                })
            ],
            center: OpenLayers.LonLat.doNew(config.centerLon, config.centerLat)
        });

        this.addLayers(layers);

        this.addControls([
            PoziGeolocate.doNew(layers.currentLocation),
            OpenLayers.Control.SelectFeature.doNew(layers.data, {
                autoActivate: true,
                onSelect: function(feature) {
                    this.unselect(feature);
                    detailsPage.update(feature).changeTo();
                }
            })
        ]);

        this.events.register('moveend', this, function() { this.updateData(); });

        this.zoomTo(defaultZoomLevel);

        this.updateData();
    };

    PoziMap.prototype = OpenLayers.Map.doNew();
    return PoziMap;

});
  

