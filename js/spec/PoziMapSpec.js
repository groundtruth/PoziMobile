define(["spec/SpecHelper", "PoziMap"], function(SpecHelper, PoziMap) {

    describe("PoziMap", function() {
        var subject, detailsPage;

        beforeEach(function() {
          // setFixtures('<div id="map"></div>');
          detailsPage = jasmine.createSpyObj("detailsPage", ["update", "changeTo"]);
          subject = PoziMap.doNew(detailsPage);
        });

        it("should work", function() {
        });

    });

});

