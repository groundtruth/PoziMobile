define(["spec/SpecHelper", "Squire", "underscore"], function(SpecHelper, Squire, _) {

    describe("configLoader", function() {

        describe(".load", function() {

            var isDone, userCallback;

            beforeEach(function() {
                isDone = false;
                userCallback = jasmine.createSpy("userCallback").andCallFake(function() { isDone = true; });
                runs(function(){
                    var injector = new Squire();
                    injector.mock("js/appId", Squire.Helpers.constructs({ configURL: function() { return "config-demo-demo.json"; }}));
                    injector.require(["js/configLoader"], function(configLoader) {
                        configLoader.load(userCallback);
                    });
                });
                waitsFor(function(){ return isDone; });
            });

            it("should load config from the right JSON file", function() {
                expect(userCallback.mostRecentCall.args[0]["demoTestKey"]).toEqual("demoTestValue");
            });

            it("should combine fetched config with some defaults", function() {
                expect(userCallback.mostRecentCall.args[0]["defaultTestKey"]).toEqual("defaultTestValue");
            });

        });

    });

});

