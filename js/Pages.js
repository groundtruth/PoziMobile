define([
    "js/pages/Search",
    "js/pages/Main",
    "js/pages/Details",
    "js/Syncher",
    "js/configLoader"
], function(
    Search,
    Main,
    Details,
    Syncher,
    configLoader
) {

    return function(done) {
        var that = this;
        configLoader.load(function(config) {

            var syncher = Syncher.doNew(that);
            var main = Main.doNew({ syncher: syncher, config: config, pages: that });
            var search = Search.doNew(that, config);

            that.setSyncButton = function(icon, label) { main.setSyncButton(icon, label); };
            that.updateData = function() { main.updateData(); };
            that.showMapAt = function(bounds) { main.showMapAt(bounds); };
            that.openSearch = function() { search.changeTo(); };

            syncher.updateInterface();

            if (typeof done === 'function') { done(that); }
        });
    };

});

