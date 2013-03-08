define(["jquery.mobile", "pages/main", "pages/details", "Syncher"], function(jq, main, details, Syncher) {

    return {
        initAll: function() {
            main.init(details);
            var syncher = new Syncher(main);
            details.init(syncher);
        }
    };

});
  

