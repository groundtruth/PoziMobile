define([
    "js/pages/Main",
    "js/pages/Details",
    "js/Syncher",
    "js/configLoader"
], function(
    Main,
    Details,
    Syncher,
    configLoader
) {

    return function(done) {
        var that = this;
        configLoader.load(function(config) {

            var syncher = Syncher.doNew(that, config);
            var main = Main.doNew({ syncher: syncher, config: config });

            that.setSyncButton = function(icon, label) { main.setSyncButton(icon, label); };
            that.updateData = function() { main.updateData(); };

            syncher.updateInterface();

            if (typeof done === 'function') { done(that); }
        });
    };

});

