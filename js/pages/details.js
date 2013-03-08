define(["jquery", "underscore", "config", "buildField"], function($, _, config, buildField) {
    var $page = $("#pageDetails");

    var initForm = function() {
        var formFields = _(config.detailsFields.concat(config.genericDetailsFields)).map(function(fieldConf) {
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

    var initButtons = function(buttonsToActions) {
        var buttons = {
            save: '<input type="button" id="saveButton" data-theme="a" class="submit" value="Save" />',
            delete: '<button id="deleteButton" data-theme="a" class="">Delete</button>'
        }
        var controlGroup = '<div data-role="controlgroup" data-type="horizontal" class="ui-btn-right">'+
                               _(buttonsToActions).keys().map(function(name) { return buttons[name]; }).join("\n") +
                           '</div>';
        $page.find('header [data-role="controlgroup"]').remove();
        $page.find("header").append(controlGroup).trigger("create");
        $page.find("input.submit").first().off("click").click(buttonsToActions["save"]);
        $page.find("#deleteButton").off("click").click(buttonsToActions["delete"]);
    };

    var syncher;

    var result = {
        init: function(givenSyncher) {
            syncher = givenSyncher;
            $page.css("visibility", "visible");
            return this;
        },
        new: function(position) {
            initForm();
            $page.find('[name="lon"]').first().val(position.lon);
            $page.find('[name="lat"]').first().val(position.lat);
            initButtons({
                save: function() {
                    history.back();
                    syncher.persist("create", $page.find("#detailsForm").serialize());
                    return false;
                }
            });
            return this;
        },
        update: function(feature) {
            initForm();
            repopulateForm(feature.data);
            initButtons({
                delete: function() {
                    if (confirm("Are you sure you want to delete this record?")) {
                        history.back();
                        syncher.persist("delete", $page.find("#detailsForm").serialize());
                    }
                    return false;
                },
                save: function() {
                    history.back();
                    syncher.persist("update", $page.find("#detailsForm").serialize());
                    return false;
                }
            });
            return this;
        },
        changeTo: function() {
            $.mobile.changePage($page, { transition: "flip" });
            return this;
        },

    };

    return result;

});

