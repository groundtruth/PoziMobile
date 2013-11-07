define(["spec/SpecHelper", "js/layers/data"], function(SpecHelper, data) {

    describe("layers/data", function() {
        describe("#getFeaturesAround", function() {

            var lon, lat, lonWebMercator, latWebMercator, handler, responseData, configData, subject;

            beforeEach(function() {
                configData = {
                  restEndpoint: "http://example.com/rest",
                  featuresLimit: 33,
                  iconName: "somicon.png"
                };
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
                subject = data.doNew(configData).layer;
            });

            it("should make the right request to the server", function() {
                subject.getFeaturesAround({ lon: lon, lat: lat });
                expect($.getJSON).toHaveBeenCalled();
                var querySuffix = '/closest/'+lon+'/'+lat+'/limit/'+configData.featuresLimit;
                expect($.getJSON.mostRecentCall.args[0]).toEqual(configData.restEndpoint+querySuffix);
                expect($.getJSON.mostRecentCall.args[1]).toEqual(jasmine.any(Function));
            });

            describe("success handler", function() {

                beforeEach(function() {
                    subject.getFeaturesAround({ lon: lon, lat: lat });
                    var handler = $.getJSON.mostRecentCall.args[1];
                    handler(responseData, jasmine.createSpy("textStatus"));
                });

                it("should place the features with the right data", function() {
                    expect(subject.features[0].data).toEqual({
                        comments: responseData.features[0].properties.comments,
                        id: responseData.features[0].properties.id
                    });
                });

                it("should place the features in the right places", function() {
                    expect(subject.features[0].geometry.x).toBeCloseTo(lonWebMercator, -4);
                    expect(subject.features[0].geometry.y).toBeCloseTo(latWebMercator, -3);
                });

                it("should not duplicate features or 'remove' them without destroying them", function() {
                    subject.getFeaturesAround({ lon: lon, lat: lat });
                    $.getJSON.mostRecentCall.args[1](responseData, jasmine.createSpy("textStatus"));
                    expect(subject.features.length).toEqual(1);

                    subject.getFeaturesAround({ lon: lon, lat: lat });
                    $.getJSON.mostRecentCall.args[1](responseData, jasmine.createSpy("textStatus"));
                    expect(subject.features.length).toEqual(1);

                });

            });

            describe("when no success", function() {

                it("should not remove features from a previously successful fetch", function() {
                    subject.getFeaturesAround({ lon: lon, lat: lat });
                    var handler = $.getJSON.mostRecentCall.args[1];
                    handler(responseData, jasmine.createSpy("textStatus"));
                    var successfullyFetchedFeatureId = subject.features[0].id;
                    subject.getFeaturesAround({ lon: lon, lat: lat });
                    expect(subject.features[0].id).toEqual(successfullyFetchedFeatureId);
                });

            });

        }); // #getFeaturesAround
    });

});

