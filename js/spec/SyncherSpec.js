define(["spec/SpecHelper", "Syncher"], function(SpecHelper, Syncher) {

    var subject = new Syncher();

    describe("syncher", function() {

        it("should be an object", function() {
            expect(typeof(subject)).toBe("object");
        });


    });

});

