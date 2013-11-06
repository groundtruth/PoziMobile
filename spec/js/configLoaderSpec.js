define(["spec/SpecHelper", "Squire", "underscore"], function(SpecHelper, Squire, _) {

    describe("configLoader", function() {

        describe(".load", function() {

            it("should load config from the right JSON file", function() {
                var isDone = false;
                var userCallback = jasmine.createSpy("userCallback").andCallFake(function() { isDone = true; });
                runs(function(){
                    var injector = new Squire();
                    injector.mock("js/appId", Squire.Helpers.constructs({ configURL: function() { return "config-demo-demo.json"; }}));
                    injector.require(["js/configLoader"], function(configLoader) {
                        configLoader.load(userCallback);
                    });
                });
                waitsFor(function(){ return isDone; });
                runs(function() {
                    expect(userCallback.mostRecentCall.args[0]["demoTestKey"]).toEqual("demoTestValue");
                });
            });

        });

        // it("should combine fetched config with some defaults", function() {
        // });

        // it("should load the correct URL", function() {
        // });

    });

});

