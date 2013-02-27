define(["jquery"], function($) {

    var $page = $("#pageDetails");
    var result = {
        init: function() {
            $page.css("visibility", "visible");
            return this;
        },
        dataInit: function(feature) {
            $.each(feature.data, function(name, val){
                var $el = $page.find('[name="'+name+'"]');
                switch($el.attr("type")){
                    case "checkbox":
                        $el.attr("checked", "checked");
                        break;
                    case 'radio':
                        $el.filter('[value="'+val+'"]').attr("checked", "checked");
                        break;
                    default:
                        $el.val(val);
                }
            });
            return this;
        },
        changeTo: function() {
            $.mobile.changePage($page, { transition: "flip" });
            return this;
        }

    };

    return result;

});
  

