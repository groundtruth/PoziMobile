define(["jquery.mobile", "pages/main", "pages/details"], function(jq, main, details) {

    return {
        initAll: function() {
            main.init();
            details.init();
        }
    };

});
  

