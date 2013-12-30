define(["spec/SpecHelper", "js/pages/Details", "js/formBuilder"], function(SpecHelper, Details, formBuilder) {

    describe("pages/Details", function() {
        var syncher, subject, configData;

        beforeEach(function() {
            setFixtures('<section id="pageDetails" style="visibility: hidden">\
                             <header></header>\
                             <div class="content"></div>\
                         </section>');
            configData = {
                detailsFields: [{ "type": "textarea", "id": "comments", "description": "Comments" }]
            }
            syncher = jasmine.createSpyObj("syncher", ["persist"]);
            subject = Details.doNew(syncher, configData);
        });

        it("should set the page to visible", function() {
            expect($("#pageDetails")).toHaveCss({ visibility: "visible"});
        });

        describe("#new", function() {

            beforeEach(function() {
                subject.new({ properties: [] });
            });

            it("should return and persist with correct action on click of save", function() {
                spyOn(history, "back");
                $("#saveButton").click();
                expect(history.back).toHaveBeenCalled();
                expect(syncher.persist.mostRecentCall.args[0].action).toBe('create');
            });

        });

        describe("#update", function() {
            var feature, commentsOnEnhance;

            beforeEach(function() {
                feature = { properties: { id: 66, comments: "hello" } };
                spyOn(history, "back");
                subject.update(feature);
            });

            it("should return and persist with correct action on click of save", function() {
                $("#saveButton").click();
                expect(history.back).toHaveBeenCalled();
                expect(syncher.persist.mostRecentCall.args[0].action).toBe('update');
            });

            it("should confirm, return and persist with correct action on click of delete", function() {
                spyOn(window, "confirm").andReturn(true);
                $("#deleteButton").click();
                expect(window.confirm).toHaveBeenCalledWith(jasmine.any(String));
                expect(history.back).toHaveBeenCalled();
                expect(syncher.persist.mostRecentCall.args[0].action).toBe('delete');
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

