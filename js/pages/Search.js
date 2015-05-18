define([
    "jquery",
    "underscore",
    "mustache",
    "openlayers"
], function(
    $,
    _,
    Mustache,
    OpenLayers
) {

    return function(pages, config) {

        var that = this;
        var minQueryLength = 3;
        var $page = $("#pageSearch");
        var request;

        $page.on("pageinit",function(e) {

            if (config.hasOwnProperty('search')) {
                var $input = $page.find('input#search-input');
                var $inputLabel = $page.find('label#search-label');
                var $list = $page.find('.search ul');
                $inputLabel.html(config.search.placeholderText);
                $input.keyup(function() {

                    if ($input.val().length < minQueryLength) {

                        $list.html('');
                        $list.listview('refresh');

                    } else {

                        var q = encodeURIComponent($input.val().replace(/[\~\!\*\(\)\']/g, ''));
                        var url = Mustache.render(config.search.restEndpoint, { q: q });

                        if (request && request.readyState != 4) { request.abort(); }

                        request = OpenLayers.Request.GET({
                            url: url,
                            success: function(response) {
                                var reader = OpenLayers.Format.GeoJSON.doNew();
                                var features = reader.read(response.responseText);
                                $list.html('');
                                _(features).each(function(feature) {
                                    var label = $.map(config.search.labelField,function(v){
                                        return feature.attributes[v];
                                    }).join(" - ");
                                    $list.append('<li><a href="#">'+label+'</a></li>')
                                    $list.children().last().click(function() {
                                        var bounds = feature.geometry.getBounds().transform("EPSG:4326", "EPSG:900913");
                                        pages.showMapAt(bounds);
                                    });
                                });
                                $list.listview('refresh');
                            }
                        });

                    }
                });
            }
        });

        this.changeTo = function() {
            $.mobile.changePage($page, { transition: "none" });
            return that;
        };

        $page.on("pageshow",function(e) {
            $page.find('input#search-input').focus();
        });

        $page.css("visibility", "visible");

    };

});

