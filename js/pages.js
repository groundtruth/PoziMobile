define(["jquery.mobile", "pages/main", "pages/form"], function(jq, main, form) {

    return {
        initAll: function() {
            main.init();
            form.init();
        }
    };

});
  

