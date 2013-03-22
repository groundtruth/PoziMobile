define(["jquery", "underscore", "config", "formBuilder"], function($, _, config, formBuilder) {

    return function(givenSyncher) {

        var syncher = givenSyncher;
        var $page = $("#pageDetails");

        var initForm = function(repopulationCallback) {
            var formFields = _(config.detailsFields.concat(config.genericDetailsFields)).map(function(fieldConf) {
                return formBuilder.buildField(fieldConf);
            }).join("\n");
            $page.find(".content").first().html(formFields)
            if (repopulationCallback) { repopulationCallback(); }
            $page.find(".content").first().trigger("create");
            $page.find('[name="config"]').first().val(config.databaseName);
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


        this.new = function(position) {
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
        };

        this.update = function(feature) {
            initForm(function() {
              formBuilder.repopulateForm($page, feature.data);
            });
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
        };

        this.changeTo = function() {
            $.mobile.changePage($page, { transition: "flip" });
            return this;
        };


        $page.css("visibility", "visible");

    };

});

