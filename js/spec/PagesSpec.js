define(["spec/SpecHelper", "Pages", "pages/Main"], function(SpecHelper, Pages, Main) {

    describe("Pages", function() {
        var subject, main, details, syncher;

        beforeEach(function() {
            spyOn(Main, "doNew").andReturn(main = jasmine.createSpyObj("pages", ["setSyncButton", "updateData"]));
            subject = Pages.doNew(); 
        });

        describe("#setSyncButton", function() {
            it("should delegate to main page", function() {
                var icon = jasmine.createSpy("icon");
                var label = jasmine.createSpy("label");
                subject.setSyncButton(icon, label);
                expect(main.setSyncButton).toHaveBeenCalledWith(icon, label);
            });
        });

        describe("#updateData", function() {
            it("should delegate to main page", function() {
                subject.updateData();
                expect(main.updateData).toHaveBeenCalledWith();
            });
        });

    });

});

