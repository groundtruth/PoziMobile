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
        var defaultZoomLevel = config.data().defaultZoomLevel;
        var geolocate = PoziGeolocate.doNew(layers.currentLocation);
        var that = this;

        this.getCenterInWGS84 = function() {
            return this.getCenter().transform(proj.webMercator, proj.WGS84);
        };

        this.setCenterAndZoomToExtent = function(pointInWebMercator, extent) {
            if (extent) {
                var zoomWithinLimit = Math.min(this.getZoomForExtent(extent), config.data().maxZoom);
                this.setCenter([pointInWebMercator.x, pointInWebMercator.y], zoomWithinLimit);
            } else {
                this.setCenter([pointInWebMercator.x, pointInWebMercator.y]);
            }
        };

        this.startFollowingLocation = function() { return geolocate.startFollowing(); };
        this.stopFollowingLocation = function() { return geolocate.stopFollowing(); };
        this.isFollowingLocation = function() { return geolocate.isFollowing(); };

        this.setSize = function() {
            // this height is full window, behind header/footer - allows for scroll off of URL bar on mobile
            // -1 adjustment so rounding errors don't create a scrollable area
            $("#map").height($(window).innerHeight() - 1);
            $("#map").width($(window).width());
        };

        $(window).on("resize", function() { that.setSize(); });
        $(window).on("orientationchange", function() { that.setSize(); });
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
            maxExtent: OpenLayers.Bounds.doNew(   /* use restrictedExtent instead to actually stop the user from moving out of it */
                config.data().maxExtentBounds[0],
                config.data().maxExtentBounds[1],
                config.data().maxExtentBounds[2],
                config.data().maxExtentBounds[3]
            ),
            controls: [
                OpenLayers.Control.Attribution.doNew(),
                // OpenLayers.Control.Navigation.doNew({ zoomWheelEnabled: true }), // not included in mobile version
                OpenLayers.Control.TouchNavigation.doNew({
                    dragPanOptions: {
                        interval: 100,
                        enableKinetic: true
                    }
                })
            ],
            center: OpenLayers.LonLat.doNew(config.data().centerLon, config.data().centerLat)
        });

        this.addLayers(layers);

        this.addControls([
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
  

