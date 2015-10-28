define([
    "jquery",
    "underscore",
    "openlayers",
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

        this.zoomToExtentMax = function(extent) {
            var zoomWithinLimit = Math.min(this.getZoomForExtent(extent), config.maxZoom);
            this.setCenter([(extent.left+extent.right)/2, (extent.bottom+extent.top)/2], zoomWithinLimit);
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


        // This is a workaround to fix an issue that appears to be with OpenLayers.
        // It is highly likely this issue will be fixed in some later version of OpenLayers.
        // Once fixed in OpenLayers this function should be removed.
        // http://thinkgeo.com/forums/MapSuite/tabid/143/aft/11896/Default.aspx
        // https://github.com/openlayers/openlayers/issues/669
        this.OnMapCreating = function (map) {
            OpenLayers.Tile.prototype.destroy = function () {
                if (this.layer.map.tileManager != null) {
                    OpenLayers.Util.removeItem(this.layer.map.tileManager.tileQueue[this.layer.map.id], this);
                }

                this.layer = null;
                this.bounds = null;
                this.size = null;
                this.position = null;

                if (this.eventListeners) {
                    this.events.un(this.eventListeners);
                }
                this.events.destroy();
                this.eventListeners = null;
                this.events = null;
            };
        }

        that.OnMapCreating(OpenLayers.Map);


        OpenLayers.Map.call(this, {
            div: "map",
            theme: null,
            projection: proj.webMercator,
            units: "m",
            numZoomLevels: 25,
            maxResolution: 156543.0339,
            maxExtent: OpenLayers.Bounds.doNew(   /* use restrictedExtent instead to actually stop the user from moving out of it */
                config.maxExtentBounds[0],
                config.maxExtentBounds[1],
                config.maxExtentBounds[2],
                config.maxExtentBounds[3]
            ),
            controls: [
                OpenLayers.Control.Attribution.doNew()
                // OpenLayers.Control.Navigation.doNew({ zoomWheelEnabled: true }), // not included in mobile version
            ],
            center: OpenLayers.LonLat.doNew(config.centerLon, config.centerLat)
        });

        this.addLayers(layers.list);

        var touchNav = OpenLayers.Control.TouchNavigation.doNew({
            dragPanOptions: {
                interval: 100,
                enableKinetic: true
            },
            defaultClick: function(evt) {
                // For panning to work on desktop and mobile, the touch navigation controller must be added last.
                // With the touch navigation controller last, feature selection by touch won't get to the SelectFeature controller without help.
                // This assumes all features have geometries with an x and y (like a point).
                if (evt.type === 'touchend' ) { // It's a mobile touch, so manually try feature selection.
                    var map = that;

                    var featuresEtc = _(map.getControlsByClass('OpenLayers.Control.SelectFeature')).chain().map(function(control) {
                        return _(control.layer.features).map(function(feature) {
                            if (feature && feature.geometry)
                            {
                                var featureXY = map.getViewPortPxFromLonLat(new OpenLayers.LonLat([feature.geometry.x, feature.geometry.y]));
                                return {
                                    control: control,
                                    feature: feature,
                                    pxDistance: Math.sqrt(Math.pow((evt.xy.x-featureXY.x), 2) + Math.pow((evt.xy.y-featureXY.y), 2))
                                }
                            }
                            else
                            {
                                //console.log('Issue with feature: '+feature.toString());
                                // Case when the feature is undefined, it happens on HTC
                                return {
                                    feature: feature,
                                    pxDistance: 'a galaxy far, far away'
                                }
                            }
                        });
                    }).flatten().value();

                    var closestFeatureEtc = _(featuresEtc).sortBy(function(featureEtc) {
                        var farAway = 9999999999;
                        return isNaN(featureEtc.pxDistance) ? farAway : featureEtc.pxDistance;
                    })[0];

                    var closeEnoughPxDistance = 30;
                    if (closestFeatureEtc && (closestFeatureEtc.pxDistance <= closeEnoughPxDistance)) {
                        closestFeatureEtc.control.select(closestFeatureEtc.feature);
                    }

                }
            }
        });

        this.addControls(_(layers.list).chain().map(function(layer) {
            return typeof(layer.controls) === 'function' ? layer.controls() : undefined;
        }).flatten().compact().value());
        this.addControls([touchNav]); // For panning to work desktop and mobile, the touch navigation controller must be added last.

        this.events.register('moveend', this, function() { this.updateData(); });

        this.zoomTo(defaultZoomLevel);

        this.updateData();
    };

    PoziMap.prototype = OpenLayers.Map.doNew();
    return PoziMap;

});


