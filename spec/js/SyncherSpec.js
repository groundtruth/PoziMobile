define(["spec/SpecHelper", "js/Syncher", "js/config"], function(SpecHelper, Syncher, config) {

    describe("Syncher", function() {
        var pages, subject, formData, configData, appId;

        beforeEach(function() {
            localStorage.clear();
            appId = config.appId(window.location.href);
            configData = jasmine.createSpyObj("configData", ["createEndpoint", "updateEndpoint", "deleteEndpoint"]);
            spyOn(config, "data").andReturn(configData);
            pages = jasmine.createSpyObj("pages", ["setSyncButton", "updateData"]);
            formData = "formData";
            subject = Syncher.doNew(pages);
        });

        describe("#persist", function() {

            describe("with a successfull change", function() {
                var setSyncButtonCalls = [];

                beforeEach(function() {
                    spyOn($, "ajax");

                    subject.persist("create", formData);
                    expect(pages.setSyncButton.callCount).toEqual(1);

                    $.ajax.argsForCall[0][0].success(jasmine.createSpy("ajaxEvent"));
                    expect(pages.setSyncButton.callCount).toEqual(2);
                });

                it("should show the spinner and a count active requests", function() {
                    expect(pages.setSyncButton.argsForCall[0]).toEqual(["pm-spinner", 1]);
                });

                it("should make the right ajax call", function() {
                    expect($.ajax.callCount).toEqual(1);
                    var req = $.ajax.mostRecentCall.args[0];
                    expect(req.type).toEqual("POST");
                    expect(req.url).toEqual(configData.createEndpoint);
                    expect(req.data).toEqual(formData);
                });

                it("should show the tick and no count when done", function() {
                    expect(pages.setSyncButton.mostRecentCall.args).toEqual(["check", "&nbsp;"]);
                });

            });

            describe("with a failing change", function() {

                beforeEach(function() {
                    spyOn($, "ajax");
                    subject.persist("delete", formData);
                    $.ajax.argsForCall[0][0].error(jasmine.createSpy("ajaxEvent"));
                });

                it("should remember failed change", function() {
                    expect(pages.setSyncButton.mostRecentCall.args[1]).toEqual(1);
                });

                it("should show a retry icon when there are waiting (non-active) changes", function() {
                    expect(pages.setSyncButton.mostRecentCall.args[0]).toEqual("refresh");
                });

                it("should retry previously failed changes (as well as new one) on next #persist call", function() {
                    expect($.ajax.callCount).toEqual(1);
                    subject.persist("update", formData);
                    expect($.ajax.callCount).toEqual(3);
                });

                it("should handle old change succeeding, new failing", function() {
                    subject.persist("update", formData);
                    expect(pages.setSyncButton.mostRecentCall.args).toEqual(["pm-spinner", 2]);

                    $.ajax.argsForCall[$.ajax.argsForCall.length-2][0].success(jasmine.createSpy("ajaxEvent"));
                    expect(pages.setSyncButton.mostRecentCall.args).toEqual(["pm-spinner", 1]);

                    $.ajax.argsForCall[$.ajax.argsForCall.length-1][0].error(jasmine.createSpy("ajaxEvent"));
                    expect(pages.setSyncButton.mostRecentCall.args).toEqual(["refresh", 1]);
                });

            });

            describe("with an active change", function() {

                xit("should try the new change immediately (not just add and wait for ac)", function() {
                    spyOn($, "ajax");
                    subject.persist("delete", formData);
                    expect($.ajax.callCount).toEqual(1); // first request made but not returned
                    subject.persist("update", formData);
                    expect($.ajax.callCount).toEqual(2); // second request
                });

            });

        }); // #persist

        describe("#processQueue", function() {

            describe("with one change waiting, one change active", function() {

                beforeEach(function() {
                    spyOn(window, "alert");
                    spyOn($, "ajax");

                    subject.persist("delete", formData);
                    subject.persist("update", formData);
                    $.ajax.argsForCall[0][0].error(jasmine.createSpy("ajaxEvent"));

                    expect($.ajax.callCount).toEqual(2);
                });

                it("should retry changes that are not already (or still) active", function() {
                    subject.processQueue();
                    expect($.ajax.callCount).toEqual(3);
                });

            });

            describe("with no waiting or active changes", function() {
              
                it("should do nothing when invoked programatically", function() {
                    spyOn(window, "alert");
                    spyOn($, "ajax");
                    subject.processQueue();
                    expect(window.alert).not.toHaveBeenCalled();
                    expect($.ajax).not.toHaveBeenCalled();
                });

                it("should explain there are no unsynchronised changes when invoked manually", function() {
                    spyOn(window, "alert");
                    subject.processQueue(true);
                    expect(window.alert.mostRecentCall.args[0]).toMatch(/no unsynchronised/);
                });

            });

        }); // #processQueue

        describe("queue backup via web storage", function() {

            beforeEach(function() {
                spyOn(localStorage, "setItem");
                spyOn($, "ajax");
                subject.persist("create", "form data");
                $.ajax.mostRecentCall.args[0].success(jasmine.createSpy("ajaxEvent"));
                subject.persist("delete", "form data");
                $.ajax.mostRecentCall.args[0].error(jasmine.createSpy("ajaxEvent"));
            });

            it("should initially backup in waiting queue", function() {
                expect(localStorage.setItem.argsForCall[0]).toEqual([jasmine.any(String),
                    JSON.stringify({ waiting: [{ action: "create", data: "form data" }], active: []})
                ]);
            });

            it("should backup again when moved into active queue", function() {
                expect(localStorage.setItem.argsForCall[1]).toEqual([jasmine.any(String),
                    JSON.stringify({ waiting: [], active: [{ action: "create", data: "form data" }]})
                ]);
            });

            it("should remove from backed up queues if successfully persisted", function() {
                expect(localStorage.setItem.argsForCall[2]).toEqual([jasmine.any(String),
                    JSON.stringify({ waiting: [], active: []})
                ]);
            });

            it("should back up back in waiting queue if there was an error persisting", function() {
                // localStorage.setItem.argsForCall[3]; // queue delete
                // localStorage.setItem.argsForCall[4]; // waiting->active for delete
                expect(localStorage.setItem.argsForCall[5]).toEqual([jasmine.any(String),
                    JSON.stringify({ waiting: [{ action: "delete", data: "form data" }], active: []})
                ]);
            });

            it("should use a key that is unqiue for this application (not just domain)", function() {
                expect(localStorage.setItem.argsForCall.length).toBeGreaterThan(0);
                _(localStorage.setItem.argsForCall).each(function(args) {
                    expect(args[0]).toEqual(["pozimobile", appId.client, appId.appName].join("-"));
                });
            });

        });

        describe("queue recovery via web storage", function() {
            var key, subject;

            beforeEach(function() {
                key = ["pozimobile", appId.client, appId.appName].join("-");
                spyOn(localStorage, "getItem").andReturn(JSON.stringify({
                  waiting: [{ action: "create", data: "form data" }],
                  active: [{ action: "update", data: "new data" }]
                }));
                spyOn(localStorage, "setItem");
                subject = Syncher.doNew(pages);
            });

            it("should load any backup when starting", function() {
                expect(localStorage.getItem).toHaveBeenCalledWith(key);
            });

            it("should move any previously active changes back into waiting", function() {
                expect(localStorage.setItem.argsForCall[0]).toEqual([key, JSON.stringify({
                    waiting: [
                        { action: "create", data: "form data" },
                        { action: "update", data: "new data" }
                    ],
                    active: []
                })]);
            });

            it("should update the interface to show any pending changes", function() {
                expect(pages.setSyncButton.mostRecentCall.args).toEqual(["refresh", 2]);
            });

        });

        describe("localStorage errors", function() {

            it("should alert on instantiation when not available", function() {
                spyOn(window, "alert");
                var replacementLocalStorage = null
                Syncher.doNew(pages, replacementLocalStorage);
                expect(window.alert).toHaveBeenCalled();
                expect(window.alert.mostRecentCall.args[0]).toMatch(/not providing web storage/);
            });

            it("should alert if localStorage quota is exceeded", function() {
                spyOn(window, "alert");
                spyOn(window.localStorage, "setItem").andThrow(new Error("Quota exceeded!"));
                spyOn($, "ajax");
                var subject = Syncher.doNew(pages);
                subject.persist("create", "form data");
                expect(window.alert).toHaveBeenCalled();
                expect(window.alert.mostRecentCall.args[0]).toMatch(/quota.*exceeded/);
            });

        });

    });

});

