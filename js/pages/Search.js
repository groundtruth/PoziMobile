define(["jquery", "underscore"], function($, _) {

    return function(pages, config) {

        var that = this;
        var $page = $("#pageSearch");

        if (config.hasOwnProperty('search')) {
            $page.find('input#search-input').attr('placeholder', config.search.placeholderText);

        }

        this.changeTo = function() {
            $.mobile.changePage($page, { transition: "flip" });
            $page.find('input#search-input').focus();
            return that;
        };

        $page.css("visibility", "visible");

    };

});

