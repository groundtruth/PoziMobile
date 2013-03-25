define(["spec/SpecHelper", "underscore", "config"], function(SpecHelper, _, config) {

    describe("config", function() {

        describe("#configURL", function() {

            it("should combine client name and app name", function() {
                expect(config.configURL("http://client.pozi.com/m/app/")).toEqual("config/client-app.json");
            });

            it("should not mistake file part of URL for app name", function() {
                expect(config.configURL("http://client.pozimobile.dev/m/app/index.html")).toEqual("config/client-app.json");
            });

            it("should handle only getting subdomain set (for development purposes)", function() {
                expect(config.configURL("http://client.pozimobile.dev/")).toEqual("config/client.json");
            });

            it("should handle only getting subdomain set, including an app name (for development purposes)", function() {
                expect(config.configURL("http://client-app.pozimobile.dev/")).toEqual("config/client-app.json");
            });

        });

        describe("#fetchConfig", function() {
            var result;
            
            beforeEach(function() {
                spyOn(config, "configURL").andReturn("correctURL");
                spyOn($, "ajax").andReturn({ responseText: '{ "someKey": 32 }' });
                result = config.fetchConfig();
            });

            it("should make a sync request", function() {
                expect($.ajax.mostRecentCall.args[0].async).toEqual(false);
            });

            it("should make its request with URL given by #configURL", function() {
                expect($.ajax.mostRecentCall.args[0].url).toEqual("correctURL");
            });

            it("should pass window.location.href to #configURL", function() {
                expect(config.configURL).toHaveBeenCalledWith(window.location.href);
            });
            
            it("should return parsed JSON", function() {
                expect(result).toEqual({ "someKey": 32 });
            });

        });

        describe("#data", function() {
            beforeEach(function() {
                spyOn(config, "fetchConfig").andReturn({ newKey: "someValue" });
                config.forgetConfig();
            });

            it("should combine fetched config with some defaults", function() {
                var configData = config.data();
                expect(configData.newKey).toEqual("someValue");
                expect(_(configData).keys().length).toBeGreaterThan(1);
            });

            it("should call #fetchConfig if it doesn't already have it", function() {
                config.data();
                expect(config.fetchConfig).toHaveBeenCalled();
            });

            it("should not call #fetchConfig if it has it already", function() {
                config.data();
                expect(config.fetchConfig.callCount).toBe(1);
                config.data();
                expect(config.fetchConfig.callCount).toBe(1);
            });

        });

    });

});

