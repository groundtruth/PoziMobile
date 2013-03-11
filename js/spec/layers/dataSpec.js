define(["spec/SpecHelper", "config", "layers/data"], function(SpecHelper, config, data) {

    describe("layers/data", function() {
        describe("#getFeaturesAround", function() {

            var readEndpoint, featuresLimit, databaseName, lon, lat, handler;

            beforeEach(function() {
                readEndpoint = spyOn(config, "readEndpoint");
                featuresLimit = spyOn(config, "featuresLimit");
                databaseName = spyOn(config, "databaseName");
                lon = 143.65305771415987;
                lat = -36.43791886509164;
                responseData = { 
                    "type": "FeatureCollection",
                    "features": [
                        { "Type":"Feature", "properties": { "id":"12", "comments":"msg" }, "geometry": { "type":"Point", "coordinates": [15990432.821168, -4361466.021253] } }
                    ]
                };
                spyOn($, "getJSON");
            });

            it("should make the right request to the server", function() {
                data.getFeaturesAround({ lon: lon, lat: lat });
                expect($.getJSON).toHaveBeenCalled();
                expect($.getJSON.mostRecentCall.args[0]).toEqual(readEndpoint);
                expect($.getJSON.mostRecentCall.args[1]).toEqual({ lat: lat, lon: lon, limit: featuresLimit, config: databaseName });
                expect($.getJSON.mostRecentCall.args[2]).toEqual(jasmine.any(Function));
            });

            describe("success handler", function() {

                beforeEach(function() {
                    data.getFeaturesAround({ lon: lon, lat: lat });
                    var handler = $.getJSON.mostRecentCall.args[2];
                    handler(responseData, jasmine.createSpy("textStatus"));
                });

                it("should place the features with the right data", function() {
                    expect(data.features[0].data).toEqual({
                        comments: responseData.features[0].properties.comments,
                        id: responseData.features[0].properties.id
                    });
                });

                it("should place the features in the right places", function() {
                    expect(data.features[0].geometry.x).toEqual(responseData.features[0].geometry.coordinates[0]);
                    expect(data.features[0].geometry.y).toEqual(responseData.features[0].geometry.coordinates[1]);
                });

                it("should not duplicate features or 'remove' them without destroying them", function() {
                    data.getFeaturesAround({ lon: lon, lat: lat });
                    $.getJSON.mostRecentCall.args[2](responseData, jasmine.createSpy("textStatus"));
                    expect(data.features.length).toEqual(1);

                    data.getFeaturesAround({ lon: lon, lat: lat });
                    $.getJSON.mostRecentCall.args[2](responseData, jasmine.createSpy("textStatus"));
                    expect(data.features.length).toEqual(1);
                    
                });

            });

            describe("when no success", function() {

                it("should not remove features from a previously successful fetch", function() {
                    data.getFeaturesAround({ lon: lon, lat: lat });
                    var handler = $.getJSON.mostRecentCall.args[2];
                    handler(responseData, jasmine.createSpy("textStatus"));
                    var successfullyFetchedFeatureId = data.features[0].id;
                    data.getFeaturesAround({ lon: lon, lat: lat });
                    expect(data.features[0].id).toEqual(successfullyFetchedFeatureId);
                });

            });

        }); // #getFeaturesAround
    });

});

