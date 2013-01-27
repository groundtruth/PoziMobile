define(["openlayers", "proj"], function(OpenLayers, proj) {

    var PoziGeolocate = function(map, currentLocationLayer) {

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
                case 0: alert(OpenLayers.i18n("There was an error while retrieving your location: ") + e.error.message); break;
                case 1: alert(OpenLayers.i18n("The user didn't accept to provide the location: ")); break;
                case 2: alert(OpenLayers.i18n("The browser was unable to determine your location: ") + e.error.message); break;
                case 3: alert(OpenLayers.i18n("The browser timed out before retrieving the location.")); break;
            }
        });

        this.events.register("locationupdated", this, function(e) {
            var locationInWebMercator = new OpenLayers.LonLat(e.point.x, e.point.y).transform(proj.WGS84, proj.webMercator);
            currentLocationLayer.setLocationFeatures(e.point, e.position.coords.accuracy);
            map.setCenterAndZoomToExtent(locationInWebMercator, currentLocationLayer.getDataExtent())
        });

    };

    PoziGeolocate.prototype = new OpenLayers.Control.Geolocate();

    return PoziGeolocate;

});

