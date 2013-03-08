define(["jquery.mobile", "pages/Main", "pages/details", "Syncher"], function(jq, Main, Details, Syncher) {

    return {
        initAll: function() {
            var syncher, main, details;
            var mainDelegator = {
                setSyncButton: function(icon, label) { main.setSyncButton(icon, label); },
                updateData: function() { main.updateData(); }
            }
            syncher = new Syncher(mainDelegator);
            details = new Details(syncher);
            main = new Main({ details: details, syncher: syncher });
        }
    };

});
  

