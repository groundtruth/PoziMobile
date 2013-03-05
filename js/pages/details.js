define(["jquery", "underscore", "config", "buildField"], function($, _, config, buildField) {
    var $page = $("#pageDetails");

    var controlGroup = function(inner) { return '<div data-role="controlgroup" data-type="horizontal" class="ui-btn-right">'+inner+'</div>'; }
    var saveButton = '<input type="button" id="saveButton" data-theme="a" class="submit" value="Save" />';
    var deleteButton = '<button id="deleteButton" data-theme="a" class="">Delete</button>';

    var initForm = function() {
        var formFields = _(config.DetailsFields).map(function(fieldConf) {
            return buildField(fieldConf);
        }).join("\n");
        $page.find(".content").first().html(formFields).trigger("create");
        $page.find('[name="config"]').first().val(config.databaseName);
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

    var submitForm = function(endpoint) {
        $.ajax({
            type: "POST",
            url: endpoint,
            cache: false, // TODO: What's this?
            data: $page.find("#detailsForm").serialize(),
            success: function(e) { history.back(); },
            error: function(e) { alert("Could not successfully save the record."); }
        });
    }

    var doDelete = function() {
        if (confirm("Are you sure you want to delete this record?")) {
            $.ajax({
                type: "DELETE",
                url: config.deleteEndpoint,
                cache: false, // TODO: What's this?
                data: $page.find("#detailsForm").serialize(),
                success: function(e) { history.back(); },
                error: function(e) { alert("Could not successfully delete the record."); }
            });
        }
    }

    var result = {
        init: function() {
            $page.css("visibility", "visible");
            return this;
        },
        new: function(position) {
            initForm();
            $page.find('[name="lon"]').first().val(position.lon);
            $page.find('[name="lat"]').first().val(position.lat);
            $page.find('header [data-role="controlgroup"]').remove();
            $page.find("header").append(controlGroup(saveButton)).trigger("create");
            $page.find("input.submit").first().off("click").click(function() { submitForm(config.createEndpoint); });
            return this;
        },
        update: function(feature) {
            initForm();
            repopulateForm(feature.data);
            $page.find('header [data-role="controlgroup"]').remove();
            $page.find("header").append(controlGroup(deleteButton + saveButton)).trigger("create");
            $page.find("input.submit").first().off("click").click(function() { submitForm(config.updateEndpoint); });
            $page.find("#deleteButton").off("click").click(function() { doDelete(); return false; });
            return this;
        },
        changeTo: function() {
            $.mobile.changePage($page, { transition: "flip" });
            return this;
        },

    };

    return result;

});

