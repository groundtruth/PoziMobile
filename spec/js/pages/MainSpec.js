define(["spec/SpecHelper", "js/pages/Main", "js/PoziMap"], function(SpecHelper, Main, PoziMap) {

    describe("pages/Main", function() {
        var details, syncher, map, subject;

        beforeEach(function() {
            config = { layers: [] };
            syncher = jasmine.createSpyObj("syncher", ["processQueue"]);
            map = jasmine.createSpyObj("map", [
                "updateData",
                "zoomOut",
                "zoomIn",
                "isFollowingLocation",
                "startFollowingLocation",
                "stopFollowingLocation",
                "getCenterInWGS84"
            ]);
            spyOn(PoziMap, "doNew").andReturn(map);
            setFixtures('<div id="pageMain"></div>');
            subject = Main.doNew({ config: config, syncher: syncher });
        });

        it("should create the map", function() {
            expect(PoziMap.doNew).toHaveBeenCalled();
        });

        describe("#setSyncButton", function() {

            beforeEach(function() { $('<header></header>').appendTo("#pageMain"); });

            it("should remove any existing sync button", function() {
                $('<button id="syncButton" class="oldButton"></button>').appendTo("header");
                subject.setSyncButton("check", 0);
                expect($("button")).not.toHaveClass("oldButton");
            });

            it("should enhance the new button", function() {
                var createEventSpy = jasmine.createSpy("createEvent");
                $(document).on("create", "header", createEventSpy);
                subject.setSyncButton("check", 0);
                expect(createEventSpy).toHaveBeenCalled();
            });

            it("should set the requested icon", function() {
                subject.setSyncButton("someicon", 0);
                expect($("#syncButton")).toHaveData("icon", "someicon");
            });

            it("should set the right number as button text", function() {
                subject.setSyncButton("check", 99);
                expect($("#syncButton").html()).toEqual("99");
            });
        });

        describe("#updateData", function() {
            it("should delegate to map", function() {
                subject.updateData();
                expect(map.updateData).toHaveBeenCalled();
            });
        });

        describe("#toggleFollowLocation", function() {
            var button;
            var buttonOnClass = "ui-btn-on-a";

            beforeEach(function() {
                button = { classList: jasmine.createSpyObj("classList", ["add", "remove"]) };
            });

            describe("when following", function() {
                beforeEach(function() {
                    map.isFollowingLocation.andReturn(true);
                    subject.toggleFollowLocation(button);
                });

                it("should stop", function() {
                    expect(map.stopFollowingLocation).toHaveBeenCalled();
                });

                it("should show button up", function() {
                    expect(button.classList.remove).toHaveBeenCalledWith(buttonOnClass);
                });
            });

            describe("when not following", function() {
                beforeEach(function() {
                    map.isFollowingLocation.andReturn(false);
                    subject.toggleFollowLocation(button);
                });

                it("should start", function() {
                    expect(map.startFollowingLocation).toHaveBeenCalled();
                });

                it("should show button down", function() {
                    expect(button.classList.add).toHaveBeenCalledWith(buttonOnClass);
                });
            });

        });

        describe("pagebeforeshow handler", function() {
            it("should update the data", function() {
                $("#pageMain").trigger("pagebeforeshow");
                expect(map.updateData).toHaveBeenCalled();
            });
        });

    });

});

