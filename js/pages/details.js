define(["jquery"], function($) {

    var $page = $("#pageDetails");
    var result = {
        init: function() {
            $page.css("visibility", "visible");
            return this;
        },
        dataInit: function(feature) {
            // http://blog.mrnepal.com/2012/03/21/use-jquery-to-re-populate-form-with-json-data/
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
            // $page.find('[name="lat"]').first().val() // not needed for update
            // $page.find('[name="lon"]').first().val() // not needed for update
            $page.find('[name="config"]').first().val("loddongis")
            return this;
        },
        changeTo: function() {
            $.mobile.changePage($page, { transition: "flip" });
            return this;
        }

    };

    return result;

});
  

