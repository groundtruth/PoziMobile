define(["jquery.mobile", "pages/main", "pages/details", "Syncher"], function(jq, main, details, Syncher) {

    return {
        initAll: function() {
            var syncher = new Syncher(main);
            main.init({ details: details, syncher: syncher });
            details.init(syncher);
        }
    };

});
  

