define(["jquery", "underscore", "config", "buildField"], function($, _, config, buildField) {
    var $page = $("#pageDetails");

    var initForm = function() {
        var formFields = _(config.DetailsFields).map(function(fieldConf) {
            return buildField(fieldConf);
        }).join("\n");
        $page.find(".content").first().html(formFields).trigger("create");
        $page.find('[name="config"]').first().val(config.databaseName);
        $page.find("input.submit").first().click(submitForm);
    };

    var repopulateForm = function(data) {
        // http://blog.mrnepal.com/2012/03/21/use-jquery-to-re-populate-form-with-json-data/
        $.each(data, function(name, val){
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
    };

    var submitForm = function() {
        $.ajax({
            type: "POST",
            url: config.updateEndpoint,
            cache: false, // TODO: What's this?
            data: $page.find("#detailsForm").serialize(),
            success: function(e) { alert('success '+e) },
            error: function(e) { alert('error '+e) }
        });
    }

    var result = {
        init: function() {
            $page.css("visibility", "visible");
            return this;
        },
        new: function(lon, lat) {
            initForm();
            $page.find('[name="lon"]').first().val(lon);
            $page.find('[name="lat"]').first().val(lat);
            return this;
        },
        update: function(feature) {
            initForm();
            repopulateForm(feature.data);
            return this;
        },
        changeTo: function() {
            $.mobile.changePage($page, { transition: "flip" });
            return this;
        },

    };

    return result;

});

