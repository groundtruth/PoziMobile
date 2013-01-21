define(["openlayers"], function(OpenLayers) {

    var geolocate = new OpenLayers.Control.Geolocate({
        id: 'locate-control',
        geolocationOptions: {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 20000
        },
        failure: function(e) {
            switch (e.error.code) {
                case 0: alert(OpenLayers.i18n("There was an error while retrieving your location: ") + e.error.message); break;
                case 1: alert(OpenLayers.i18n("The user didn't accept to provide the location: ")); break;
                case 2: alert(OpenLayers.i18n("The browser was unable to determine your location: ") + e.error.message); break;
                case 3: alert(OpenLayers.i18n("The browser timed out before retrieving the location.")); break;
            }
        }
    });

    return geolocate;

});

