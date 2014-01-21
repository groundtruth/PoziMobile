define([
    "jquery",
    "underscore",
    "openlayers.control.navigation",
    "js/proj",
    "js/PoziGeolocate"
], function(
    $,
    _,
    OpenLayers,
    proj,
    PoziGeolocate
) {

    var PoziMap = function(config, layers) {
        var defaultZoomLevel = config.defaultZoomLevel;
        var geolocate = PoziGeolocate.doNew(layers.currentLocation);
        var that = this;

        this.getCenterInWGS84 = function() {
            return this.getCenter().transform(proj.webMercator, proj.WGS84);
        };

        this.setCenterToPoint = function(pointInWebMercator) {
            this.setCenter([pointInWebMercator.x, pointInWebMercator.y]);
        };

        this.setCenterAndZoomToExtent = function(pointInWebMercator, extent) {
            var zoomWithinLimit = Math.min(this.getZoomForExtent(extent), config.maxZoom);
            this.setCenter([pointInWebMercator.x, pointInWebMercator.y], zoomWithinLimit);
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
            layers.refreshDataAround(this.getCenterInWGS84());
        };

        OpenLayers.Map.call(this, {
            div: "map",
            theme: null,
            projection: proj.webMercator,
            units: "m",
            numZoomLevels: 20,
            maxResolution: 156543.0339,
            maxExtent: OpenLayers.Bounds.doNew(   /* use restrictedExtent instead to actually stop the user from moving out of it */
                config.maxExtentBounds[0],
                config.maxExtentBounds[1],
                config.maxExtentBounds[2],
                config.maxExtentBounds[3]
            ),
            controls: [],
            center: OpenLayers.LonLat.doNew(config.centerLon, config.centerLat)
        });

        this.addLayers(layers.list);

        this.addControls(_(layers.list).chain().map(function(layer) {
            return typeof(layer.controls) === 'function' ? layer.controls() : undefined;
        }).flatten().compact().value());

        this.addControls([
            OpenLayers.Control.Attribution.doNew(),
            OpenLayers.Control.Navigation.doNew({ zoomWheelEnabled: true }) // not included in mobile version
            // OpenLayers.Control.TouchNavigation.doNew({
            //     dragPanOptions: {
            //         interval: 100,
            //         enableKinetic: true
            //     }
            // })
        ]);

        this.events.register('moveend', this, function() { this.updateData(); });

        this.zoomTo(defaultZoomLevel);

        this.updateData();
    };

    PoziMap.prototype = OpenLayers.Map.doNew();
    return PoziMap;

});


