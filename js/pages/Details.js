define(["jquery", "underscore", "js/formBuilder", "js/proj"], function($, _, formBuilder, proj) {

    return function(givenSyncher, layerOptions) {

        var that = this;
        var syncher = givenSyncher;
        var $page = $("#pageDetails");
        var jsonGeometryPart;

        var combinedHash = function() {
            var nameValueHashes = $page.find("#detailsForm").serializeArray();
            var singlePairHashes = _(nameValueHashes).map(function(h) { var result = {}; result[h.name] = h.value; return result; });
            return _(singlePairHashes).reduce(function(memo, hash) { return _(memo).extend(hash); }, {});
        };

        var asGeoFeature = function() {
            var ignoredFormProperties = [];
            if (combinedHash()[layerOptions.idField] === '') {
                ignoredFormProperties.push(layerOptions.idField);
            }
            return _({
                "type": "Feature",
                "properties": _(combinedHash()).omit(ignoredFormProperties)
            }).extend(jsonGeometryPart);
        };

        var jsonGeometryPartAt = function(pointInWGS84) {
            return {
                "geometry": {
                    "type": "Point",
                    "crs": { "type": "name", "properties": { "name": "EPSG:4326" } },
                    "coordinates": [parseFloat(pointInWGS84.x), parseFloat(pointInWGS84.y)]
                }
            };
        };

        this.enhanceForm = function() {
            $page.find(".content").first().trigger("create");
        };

        this.triggerPrePopulators = function() {
            _(layerOptions.prePopulators).each(function(prePopulator) {
                require(prePopulator)($page); // can require sync cos these were preloaded with the config
            });
        };

        this.triggerOnSaves = function() {
            _(layerOptions.onSaves).each(function(onSave) {
                require(onSave)($page); // can require sync cos these were preloaded with the config
            });
        };

        this.initForm = function(feature) {
            var formFields = _(layerOptions.detailsFields).map(function(fieldConf) {
                return formBuilder.buildField(fieldConf);
            }).join("\n");
            $page.find(".content").first().html(formFields);

            jsonGeometryPart = {};
            if (feature) {
                if (_(feature).has('geometry')) {
                    var pointInWGS84 = feature.geometry.transform(proj.webMercator, proj.WGS84);
                    jsonGeometryPart = jsonGeometryPartAt(pointInWGS84);
                }
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
            jsonGeometryPart = jsonGeometryPartAt({ x: position.lon, y: position.lat });

            that.triggerPrePopulators();
            that.initButtons({
                save: function() {
                    that.triggerOnSaves();
                    syncher.persist({
                        restEndpoint: layerOptions.restEndpoint,
                        action: "create",
                        data: asGeoFeature()
                    });
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
                        syncher.persist({
                            restEndpoint: layerOptions.restEndpoint,
                            action: "delete",
                            data: asGeoFeature(),
                            id: combinedHash()[layerOptions.idField]
                        });
                        history.back();
                    }
                    return false;
                },
                save: function() {
                    that.triggerOnSaves();
                    syncher.persist({
                        restEndpoint: layerOptions.restEndpoint,
                        action: "update",
                        data: asGeoFeature(),
                        id: combinedHash()[layerOptions.idField]
                    });
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

