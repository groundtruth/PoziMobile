define(["js/pages/Main", "js/pages/Details", "js/Syncher"], function(Main, Details, Syncher) {

    return function() {

        var syncher = Syncher.doNew(this);
        var details = Details.doNew(syncher);
        var main = Main.doNew({ details: details, syncher: syncher });

        this.setSyncButton = function(icon, label) { main.setSyncButton(icon, label); };
        this.updateData = function() { main.updateData(); };

        syncher.updateInterface();

    };

});
  

