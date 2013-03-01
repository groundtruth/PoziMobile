define(["jquery", "underscore", "config", "buildField"], function($, _, config, buildField) {

    var $page = $("#pageDetails");
    var result = {
        init: function() {
            $page.css("visibility", "visible");
            return this;
        },
        dataInit: function(feature) {
            var formFields = _(config.DetailsFields).map(function(fieldConf) {
                return buildField(fieldConf);
            }).join("\n");
            $page.find(".content").first().html(formFields).trigger("create");

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
            $page.find('[name="config"]').first().val(config.databaseName);
            $page.find("input.submit").first().click(this.submitForm);
            return this;
        },
        changeTo: function() {
            $.mobile.changePage($page, { transition: "flip" });
            return this;
        },
        submitForm: function() {
            $.ajax({
                type: "POST",
                url: config.updateEndpoint,
                cache: false, // TODO: What's this?
                data: $page.find("#detailsForm").serialize(),
                success: function(e) { alert('success '+e) },
                error: function(e) { alert('error '+e) }
            });
        }

    };

    return result;

});

