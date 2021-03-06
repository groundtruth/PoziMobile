define(["jquery", "underscore", "js/formBuilder", "js/proj"], function($, _, formBuilder, proj) {

    return function(givenSyncher, layerOptions) {

        var that = this;
        var syncher = givenSyncher;
        var $page = $("#pageDetails");
        var incomingFeature;

        // Source: http://codereview.stackexchange.com/questions/60128/removing-duplicates-from-an-array-quickly
        Array.prototype.unique = function() {
            var unique = [];
            for (var i = 0; i < this.length; i++) {
                var current = this[i];
                if (unique.indexOf(current) < 0) unique.push(current);
            }
            return unique;
        }

        var combinedHash = function() {
            // Need to enable all fields for serialisation
            // http://stackoverflow.com/questions/15958671/disabled-fields-not-picked-up-by-serializearray
            var detailForm = $page.find("#detailsForm");
            var disabled = detailForm.find(':input:disabled').removeAttr('disabled');
            var nameValueHashes = detailForm.serializeArray();
            disabled.attr('disabled','disabled');

            var singlePairHashes = _(nameValueHashes).map(function(h) { var result = {}; result[h.name] = h.value; return result; });
            return _(singlePairHashes).reduce(function(memo, hash) { return _(memo).extend(hash); }, {});
        };

        var updatedGeoFeature = function() {
            var idFieldIfEmpty = combinedHash()[layerOptions.idField] === '' ? layerOptions.idField : undefined;
            _(incomingFeature.properties).extend(_(combinedHash()).omit(idFieldIfEmpty));

            _(layerOptions.onSaves).each(function(onSave) {
                incomingFeature = require(onSave)(incomingFeature); // can require sync cos these were preloaded with the config
            });
            return incomingFeature;
        };

        this.triggerPrePopulators = function() {
            _(layerOptions.prePopulators).each(function(prePopulator) {
                require(prePopulator)($page, incomingFeature); // can require sync cos these were preloaded with the config
            });
        };

        this.initForm = function(feature) {
            incomingFeature = feature;

            var formFields;

            // Manages field rendering with or without tabs
            if (layerOptions.detailsFields[0].hasOwnProperty("tab"))
            {
                // List of tabs
                var tabList = $.map(layerOptions.detailsFields,function(fieldConf) {
                    return fieldConf.tab;
                }).unique();

                // Tab headers
                var tabHeaders = _(tabList).map(function(tab,i){
                    return $('<a>').attr('id','a_'+i).attr('href','#').attr('data-theme','a').attr('class',i==0?'ui-btn-active':'').addClass('tab-header').css({'margin':0}).html('<p style="font-size:16px;">'+tab+'</p>');
                });
                tabHeaders = $('<div>').attr('data-role','navbar').append(
                    $('<ul>').append(tabHeaders)
                );

                // Fields inside each tab
                var tabFields = _(tabList).map(function(tab,i){
                    var fieldsInThisTab = $.grep(layerOptions.detailsFields,function(l){
                        return l.tab == tab;
                    });

                    var tabFormFields = _(fieldsInThisTab).map(function(fieldConf) {
                        return formBuilder.buildField(fieldConf);
                    }).join("\n");

                    return $('<div>').attr('id','t_'+i).css({'display':i==0?'block':'none'}).addClass('tab-content').html(tabFormFields);
                });
                formFields = $('<div>').append(tabHeaders).append(tabFields);
            }
            else
            {
                // Simple concatenation of fields
                formFields = _(layerOptions.detailsFields).map(function(fieldConf) {
                    return formBuilder.buildField(fieldConf);
                }).join("\n");
            }

            $page.find(".content").first().html(formFields);

            formBuilder.repopulateForm($page, incomingFeature.properties);

            // Managing the click behaviour on tab headers
            if (layerOptions.detailsFields[0].hasOwnProperty("tab"))
            {
                $('.tab-header').bind('click',function(){
                    var idToShow=$(this).attr('id').split("_")[1];
                    $('.tab-content').css({'display':'none'});
                    $('#t_'+idToShow).css({'display':'block'});
                });
            }            

            that.triggerPrePopulators();
        };

        this.initButtons = function(buttonsToActions) {
            var saveButtonLabel = layerOptions.saveFeatureButtonLabel || "Save";
            var saveButtonTheme = layerOptions.saveFeatureButtonTheme || "a";

            var buttons = {
                save: '<input type="button" id="saveButton" data-theme="'+saveButtonTheme+'" class="submit" value="'+saveButtonLabel+'" />',
                delete: '<button id="deleteButton" data-theme="a" class="">Delete</button>'
            }

            // Back button label
            $('section#pageDetails').attr("data-back-btn-text",layerOptions.backButtonLabel || 'Back');

            // Removing delete button if layer configured to not support deletion
            if (!layerOptions.handlesDeleteFeatures) {delete buttons['delete'];}

            var controlGroup = '<div data-role="controlgroup" data-type="horizontal" class="ui-btn-right">'+
                                   _(buttonsToActions).keys().map(function(name) { return buttons[name]; }).join("\n") +
                               '</div>';
            $page.find('header [data-role="controlgroup"]').remove();
            $page.find("header").append(controlGroup).trigger("create");
            $page.find("input.submit").first().off("click").click(buttonsToActions["save"]);
            $page.find("#deleteButton").off("click").click(buttonsToActions["delete"]);
        };

        this.new = function(feature) {
            that.initForm(feature);
            that.initButtons({
                save: function() {
                    // Disabling button to prevent double clicks
                    $(this).button('disable'); 
                    syncher.persist({
                        restEndpoint: layerOptions.restEndpoint,
                        action: "create",
                        data: updatedGeoFeature()
                    });
                    history.back();
                    // Re-enabling button for subsequent captures
                    $(this).button('enable'); 
                    return false;
                }
            });
            return this;
        };

        this.update = function(feature) {
            that.initForm(feature);
            that.initButtons({
                delete: function() {
                    if (confirm("Are you sure you want to delete this record?")) {
                        syncher.persist({
                            restEndpoint: layerOptions.restEndpoint,
                            action: "delete",
                            data: updatedGeoFeature(),
                            id: combinedHash()[layerOptions.idField]
                        });
                        history.back();
                    }
                    return false;
                },
                save: function() {
                    syncher.persist({
                        restEndpoint: layerOptions.restEndpoint,
                        action: "update",
                        data: updatedGeoFeature(),
                        id: combinedHash()[layerOptions.idField]
                    });
                    history.back();
                    return false;
                }
            });
            return this;
        };

        this.changeTo = function() {
            $.mobile.changePage($page, { transition: "none" });
            $page.find("#detailsForm").trigger('create');
            return this;
        };


        $page.css("visibility", "visible");
    };

});

