define(["jquery", "underscore", "js/formBuilder", "js/proj"], function($, _, formBuilder, proj) {

    return function(givenSyncher, config) {

        var syncher = givenSyncher;
        var $page = $("#pageDetails");
        var that = this;

        var asGeoFeature = function() {
            var nameValueHashes = $page.find("#detailsForm").serializeArray();
            var singlePairHashes = _(nameValueHashes).map(function(h) { var result = {}; result[h.name] = h.value; return result; });
            var combinedHash = _(singlePairHashes).reduce(function(memo, hash) { return _(memo).extend(hash); }, {});
            var ignoredFormProperties = ['lon', 'lat'];
            if (combinedHash[config.idField] === '') { ignoredFormProperties.push(config.idField); }
            return {
                "type": "Feature",
                "properties": _(combinedHash).omit(ignoredFormProperties),
                "geometry": {
                    "type": "Point",
                    "crs": { "type": "name", "properties": { "name": "EPSG:4326" } },
                    "coordinates": [parseFloat(combinedHash.lon), parseFloat(combinedHash.lat)]
                }
            };
        };

        this.enhanceForm = function() {
            $page.find(".content").first().trigger("create");
        };

        this.triggerPrePopulators = function() {
            _(config.prePopulators).each(function(prePopulator) {
                require(prePopulator)($page); // can require sync cos these were preloaded with the config
            });
        };

        this.triggerOnSaves = function() {
            _(config.onSaves).each(function(onSave) {
                require(onSave)($page); // can require sync cos these were preloaded with the config
            });
        };

        this.initForm = function(feature) {
            var formFields = _(config.detailsFields.concat(config.genericDetailsFields)).map(function(fieldConf) {
                return formBuilder.buildField(fieldConf);
            }).join("\n");
            $page.find(".content").first().html(formFields);
            if (feature) {
              var pointInWGS84 = feature.geometry.transform(proj.webMercator, proj.WGS84);
              $page.find('[name="lon"]').first().val(pointInWGS84.x);
              $page.find('[name="lat"]').first().val(pointInWGS84.y);
              formBuilder.repopulateForm($page, feature.data);
            };
            that.enhanceForm(); // important: this must be done after form population
        };

        this.initButtons = function(buttonsToActions) {
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
            that.initForm();
            $page.find('[name="lon"]').first().val(position.lon);
            $page.find('[name="lat"]').first().val(position.lat);
            that.triggerPrePopulators();
            that.initButtons({
                save: function() {
                    that.triggerOnSaves();
                    syncher.persist("create", asGeoFeature());
                    history.back();
                    return false;
                }
            });
            return this;
        };

        this.update = function(feature) {
            that.initForm(feature);
            that.triggerPrePopulators();
            that.initButtons({
                delete: function() {
                    if (confirm("Are you sure you want to delete this record?")) {
                        that.triggerOnSaves();
                        syncher.persist("delete", asGeoFeature());
                        history.back();
                    }
                    return false;
                },
                save: function() {
                    that.triggerOnSaves();
                    syncher.persist("update", asGeoFeature());
                    history.back();
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

