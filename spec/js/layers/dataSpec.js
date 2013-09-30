define(["spec/SpecHelper", "js/config", "js/layers/data"], function(SpecHelper, config, data) {

    describe("layers/data", function() {
        describe("#getFeaturesAround", function() {

            var lon, lat, lonWebMercator, latWebMercator, handler, responseData, configData;

            beforeEach(function() {
                configData = {
                  restEndpoint: "http://example.com/rest",
                  featuresLimit: 33,
                  iconName: "somicon.png"
                };
                spyOn(config, "data").andReturn(configData);
                lon = 143.65305771415987;
                lat = -36.43791886509164;
                lonWebMercator = 15990432.821168;
                latWebMercator = -4361466.021253;
                responseData = {
                    "type": "FeatureCollection",
                    "features": [
                        { "Type":"Feature", "properties": { "id":"12", "comments":"msg" }, "geometry": { "type":"Point", "coordinates": [143.65305771415987, -36.43791886509164] } }
                    ]
                };
                spyOn($, "getJSON");
            });

            it("should make the right request to the server", function() {
                data.getFeaturesAround({ lon: lon, lat: lat });
                expect($.getJSON).toHaveBeenCalled();
                var querySuffix = '/closest/'+lon+'/'+lat+'/limit/'+configData.featuresLimit;
                expect($.getJSON.mostRecentCall.args[0]).toEqual(configData.restEndpoint+querySuffix);
                expect($.getJSON.mostRecentCall.args[1]).toEqual(jasmine.any(Function));
            });

            describe("success handler", function() {

                beforeEach(function() {
                    data.getFeaturesAround({ lon: lon, lat: lat });
                    var handler = $.getJSON.mostRecentCall.args[1];
                    handler(responseData, jasmine.createSpy("textStatus"));
                });

                it("should place the features with the right data", function() {
                    expect(data.features[0].data).toEqual({
                        comments: responseData.features[0].properties.comments,
                        id: responseData.features[0].properties.id
                    });
                });

                it("should place the features in the right places", function() {
                    expect(data.features[0].geometry.x).toBeCloseTo(lonWebMercator, -4);
                    expect(data.features[0].geometry.y).toBeCloseTo(latWebMercator, -3);
                });

                it("should not duplicate features or 'remove' them without destroying them", function() {
                    data.getFeaturesAround({ lon: lon, lat: lat });
                    $.getJSON.mostRecentCall.args[1](responseData, jasmine.createSpy("textStatus"));
                    expect(data.features.length).toEqual(1);

                    data.getFeaturesAround({ lon: lon, lat: lat });
                    $.getJSON.mostRecentCall.args[1](responseData, jasmine.createSpy("textStatus"));
                    expect(data.features.length).toEqual(1);

                });

            });

            describe("when no success", function() {

                it("should not remove features from a previously successful fetch", function() {
                    data.getFeaturesAround({ lon: lon, lat: lat });
                    var handler = $.getJSON.mostRecentCall.args[1];
                    handler(responseData, jasmine.createSpy("textStatus"));
                    var successfullyFetchedFeatureId = data.features[0].id;
                    data.getFeaturesAround({ lon: lon, lat: lat });
                    expect(data.features[0].id).toEqual(successfullyFetchedFeatureId);
                });

            });

        }); // #getFeaturesAround
    });

});

