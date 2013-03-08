define(["spec/SpecHelper", "Syncher"], function(SpecHelper, Syncher) {

    var pages = jasmine.createSpyObj("pages", ["setSyncButton", "updateData"]);

    var subject = new Syncher(pages);

    describe("Syncher instance with empty queue", function() {

        describe("#processQueue, manually", function() {
            it("should show message", function() {
                spyOn(window, 'alert');
                subject.processQueue(true);
                expect(window.alert).toHaveBeenCalledWith(jasmine.any(String));
            });
        });

        describe("#processQueue, not manually", function() {
            it("should not show message", function() {
                spyOn(window, 'alert');
                subject.processQueue();
                expect(window.alert).not.toHaveBeenCalled();
            });
        });

        

    });

});

