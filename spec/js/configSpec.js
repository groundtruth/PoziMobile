define(["spec/SpecHelper", "underscore", "js/config", "js/appId"], function(SpecHelper, _, config, appId) {

    describe("config", function() {

        describe("#fetchConfig", function() {
            var result;

            beforeEach(function() {
                spyOn(appId, "doNew").andReturn({ configURL: function() { return "correctURL"; } });
                spyOn($, "ajax").andReturn({ responseText: '{ "someKey": 32 }' });
                result = config.fetchConfig();
            });

            it("should make a sync request", function() {
                expect($.ajax.mostRecentCall.args[0].async).toEqual(false);
            });

            it("should make its request with URL given by appId#configURL", function() {
                expect($.ajax.mostRecentCall.args[0].url).toEqual("correctURL");
            });

            it("should pass window.location.href to appId.doNew()", function() {
                expect(appId.doNew).toHaveBeenCalledWith(window.location.href);
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

