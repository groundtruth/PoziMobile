define(["openlayers", "proj"], function(OpenLayers, proj) {

    var PoziGeolocate = function(currentLocationLayer) {

        OpenLayers.Control.Geolocate.call(this, {
            id: 'locate-control',
            geolocationOptions: {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 20000
            }
        });

        this.events.register("locationfailed", this, function(e) {
            switch (e.error.code) {
                case 3 : alert("The browser timed out before retrieving your location."); break;
                case 1 : alert("Could not retrieve your location because the browser was not allowed to access it."); break;
                default: alert("There was an error while retrieving your location: " + e.error.message); break;
            }
        });

        this.events.register("locationupdated", this, function(e) {
            currentLocationLayer.setLocation(e.point, e.position.coords.accuracy);
        });

    };

    PoziGeolocate.prototype = OpenLayers.Control.Geolocate.doNew();

    return PoziGeolocate;

});

