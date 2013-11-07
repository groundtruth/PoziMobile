define(["spec/SpecHelper", "js/pages/Details", "js/formBuilder"], function(SpecHelper, Details, formBuilder) {

    describe("pages/Details", function() {
        var syncher, subject, configData;

        beforeEach(function() {
            setFixtures('<section id="pageDetails" style="visibility: hidden">\
                             <header></header>\
                             <div class="content"></div>\
                         </section>');
            configData = {
                detailsFields: [{ "type": "textarea", "id": "comments", "description": "Comments" }],
                genericDetailsFields: [
                    { "type": "hidden", "id": "lat" },
                    { "type": "hidden", "id": "lon" },
                    { "type": "hidden", "id": "id", "value": "" }
                ]
            }
            syncher = jasmine.createSpyObj("syncher", ["persist"]);
            subject = Details.doNew(syncher, configData);
        });

        it("should set the page to visible", function() {
            expect($("#pageDetails")).toHaveCss({ visibility: "visible"});
        });

        describe("#new", function() {
            var position;

            beforeEach(function() {
                position = { lon: 22, lat: 99 };
                subject.new(position);
            });

            it("should create the form with generic fields", function() {
                expect($('input[name="id"]')).toExist();
            });

            it("should fill out location as requested", function() {
                expect($('input[name="lon"]')).toHaveAttr("value", position.lon.toString());
                expect($('input[name="lat"]')).toHaveAttr("value", position.lat.toString());
            });

            it("should create the form with client-specific fields", function() {
                expect($('textarea[name="comments"]')).toExist();
            });

            it("should return and persist with correct action on click of save", function() {
                spyOn(history, "back");
                $("#saveButton").click();
                expect(history.back).toHaveBeenCalled();
                expect(syncher.persist).toHaveBeenCalledWith("create", jasmine.any(Object));
            });

        });

        describe("#update", function() {
            var feature, commentsOnEnhance;

            beforeEach(function() {
                feature = { data: { id: 66, comments: "hello" }, geometry: { transform: function() {} } };
                spyOn(feature.geometry, "transform").andReturn({ x: 22, y: 99 });
                spyOn(history, "back");
                spyOn(subject, "enhanceForm").andCallFake(function() { commentsOnEnhance = $('[name="comments"]').val(); })
                subject.update(feature);
            });

            it("should populate generic fields", function() {
                expect($('input[name="id"]')).toHaveAttr("value", feature.data.id.toString());
            });

            it("should populate client-specific fields", function() {
                expect($('[name="comments"]').val()).toEqual(feature.data.comments);
            });

            it("should not do the jQM enhancement until it has populated fields", function() {
                expect(commentsOnEnhance).toEqual(feature.data.comments);
            });

            it("should return and persist with correct action on click of save", function() {
                $("#saveButton").click();
                expect(history.back).toHaveBeenCalled();
                expect(syncher.persist).toHaveBeenCalledWith("update", jasmine.any(Object));
            });

            it("should confirm, return and persist with correct action on click of delete", function() {
                spyOn(window, "confirm").andReturn(true);
                $("#deleteButton").click();
                expect(window.confirm).toHaveBeenCalledWith(jasmine.any(String));
                expect(history.back).toHaveBeenCalled();
                expect(syncher.persist).toHaveBeenCalledWith("delete", jasmine.any(Object));
            });

        });

        describe("#changeTo", function() {
            it("should change the page", function() {
                $.mobile = jasmine.createSpyObj("jquery.mobile", ["changePage"]);
                subject.changeTo();
                expect($.mobile.changePage).toHaveBeenCalledWith($("#pageDetails"), jasmine.any(Object));
            });
        });

    });

});

