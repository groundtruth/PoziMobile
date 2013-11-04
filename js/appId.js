define([], function() {

    return function(href) {
        if (href === undefined) { throw(new Error("Need to supply a URL!")); }

        var that = this;

        var getParameterByName = function(name) {
            var match = RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
            return match && decodeURIComponent(match[1].replace(/\+/g, " "));
        };

        // example: http://client.domain.tld/m/appName

        this.client = function() {
            var m;
            var clientFromURL = (m = href.match(/^\w+:\/\/([a-z\-]+)\.[^\/\.]+\.[^\/\.]+/i)) ? m[1] : false;
            var clientFromQueryString = getParameterByName("client");
            return clientFromQueryString || clientFromURL || "demo";
        };

        this.appName = function() {
            var m;
            var appNameFromURL = (m = href.match(/^\w+:\/\/[^\/]+\/m\/([^\/]+)\//)) ? m[1] : false;
            var appNameFromQueryString = getParameterByName("appName");
            return appNameFromQueryString || appNameFromURL || "demo";
        };

        this.configURL = function() {
            if (that.client() === "demo" && that.appName() === "demo") {
                return "config-demo-demo.json";
            } else {
                return "config/" + that.client() + "-" + that.appName() + ".json";
            }
        };

    };

});

