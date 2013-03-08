define(["jquery.mobile", "pages/Main", "pages/details", "Syncher"], function(jq, Main, Details, Syncher) {

    return function() {

        var syncher = new Syncher(this);
        var details = new Details(syncher);
        var main = new Main({ details: details, syncher: syncher });

        this.setSyncButton = function(icon, label) { main.setSyncButton(icon, label); };
        this.updateData = function() { main.updateData(); };

    };

});
  

