define(["jquery"], function($) {

    var defaults = {
        "defaultZoomLevel": 15,
        "maxZoom": 18,
        "featuresLimit": 20,
        "genericDetailsFields": [
            {
                "type": "hidden",
                "id": "lat"
            },
            {
                "type": "hidden",
                "id": "lon"
            },
            {
                "type": "hidden",
                "id": "config",
                "value": "loddongis"
            },
            {
                "type": "hidden",
                "id": "id",
                "value": ""
            }
        ]
    };

    var data;

    return {

        getConfig: function() {
            return $.parseJSON(
                $.ajax({
                    type: 'GET',
                    url: 'config/loddon-mc.json',
                    dataType: 'json',
                    success: function() { },
                    data: {},
                    async: false
                }).responseText
            );
        },

        data: function() {
            if (typeof data === "undefined") {
                return data = $.extend(defaults, this.getConfig());
            } else {
                return data;
            }
        }

    };

});
 
