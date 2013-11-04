define(["spec/SpecHelper", "underscore", "js/appId"], function(SpecHelper, _, appId) {

    describe("appId", function() {

        describe("#client and #appName", function() {

            it("should get client name right", function() {
                expect(appId.doNew("http://client.pozi.com/m/app/").client()).toEqual("client");
            });

            it("should get app name right, even if there is a filename", function() {
                expect(appId.doNew("http://client.pozimobile.dev/m/app/index.html").appName()).toEqual("app");
            });

            it("should default to 'demo' for both if there is no subdomain or app name", function() {
                var otherURL = "http://127.0.0.1:8080/SpecRunner.html?spec=appId";
                expect(appId.doNew(otherURL).client()).toEqual("demo");
                expect(appId.doNew(otherURL).appName()).toEqual("demo");
            });

        });

        describe("#configURL", function() {

            it("should combine client name and app name", function() {
                expect(appId.doNew("http://client.pozi.com/m/app/").configURL()).toEqual("config/client-app.json");
            });

            it("should default to demo config if there is no subdomain or app name", function() {
                var url = "http://127.0.0.1:8080/SpecRunner.html?spec=config";
                expect(appId.doNew(url).configURL()).toEqual("config-demo-demo.json");
            });

        });

    });

});

