define(["openlayers", "proj"], function(OpenLayers, proj) {

    var PoziGeolocate = function(currentLocationLayer) {

        var watchId = undefined;
        var that = this;
        
        this.startFollowing = function() {
            that.stopFollowing();
            watchId = navigator.geolocation.watchPosition(
                function(e) {
                    currentLocationLayer.setLocation(
                        OpenLayers.Geometry.Point.doNew(e.coords.longitude, e.coords.latitude).transform(proj.WGS84, proj.webMercator),
                        e.coords.accuracy
                    );
                },
                function(e) {
                    switch (e.error.code) {
                        case 3 : alert("The browser timed out before retrieving your location."); break;
                        case 1 : alert("Could not retrieve your location because the browser was not allowed to access it."); break;
                        default: alert("There was an error while retrieving your location: " + e.error.message); break;
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        };

        this.stopFollowing = function() {
            currentLocationLayer.clearLocationMarker();
            if (that.isFollowing()) {
                navigator.geolocation.clearWatch(watchId);
                watchId = undefined;
            }
        };

        this.isFollowing = function() {
            return watchId !== undefined;
        };

    };
    return PoziGeolocate;

});

