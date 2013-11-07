define([
    "spec/SpecHelper",
    "js/Pages",
    "js/pages/Main",
    "js/Syncher"
], function(
    SpecHelper,
    Pages,
    Main,
    Syncher
) {

    describe("Pages", function() {
        var subject, main, details, syncher;

        beforeEach(function() {
            spyOn(Main, "doNew").andReturn(main = jasmine.createSpyObj("pages", ["setSyncButton", "updateData"]));
            spyOn(Syncher, "doNew").andReturn(syncher = jasmine.createSpyObj("syncher", ["updateInterface"]));

            isDone = false;
            runs(function(){
                subject = Pages.doNew(function() { isDone = true; });
            });
            waitsFor(function(){ return isDone; });
        });

        describe("constructor", function() {
            it("should tell syncher to update the interface", function() {
                expect(syncher.updateInterface).toHaveBeenCalled();
            });
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

