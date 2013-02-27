define(["jquery"], function($) {

    var $page = $("#pageDetails");
    var result = {
        init: function() {
            $page.css("visibility", "visible");
        },
        dataInit: function() {
            alert(JSON.stringify($page.data("feature").data));
        }
    };

    return result;

});
  

