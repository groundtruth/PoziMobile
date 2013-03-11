define(["spec/SpecHelper", "Syncher", "config"], function(SpecHelper, Syncher, config) {

    describe("Syncher", function() {
        var pages, subject, formData, createEndpoint, updateEndpoint, deleteEndpoint;

        beforeEach(function() {
            createEndpoint = spyOn(config, 'createEndpoint');
            updateEndpoint = spyOn(config, 'updateEndpoint');
            deleteEndpoint = spyOn(config, 'deleteEndpoint');
            pages = jasmine.createSpyObj("pages", ["setSyncButton", "updateData"]);
            formData = jasmine.createSpy("formData");
            subject = Syncher.doNew(pages);
        });

        describe("#persist", function() {

            describe("with a successfull change", function() {
                var setSyncButtonCalls = [];

                beforeEach(function() {
                    var successHandler;
                    spyOn($, 'ajax').andCallFake(function(req) { successHandler = req.success; });

                    subject.persist("create", formData);
                    
                    expect(pages.setSyncButton.callCount).toEqual(1);
                    setSyncButtonCalls.push(pages.setSyncButton.mostRecentCall.args);

                    successHandler(jasmine.createSpy("ajaxEvent"));

                    expect(pages.setSyncButton.callCount).toEqual(2);
                    setSyncButtonCalls.push(pages.setSyncButton.mostRecentCall.args);
                });

                it("should show the spinner and a count active requests", function() {
                    expect(setSyncButtonCalls[0]).toEqual(['pm-spinner', 1]);
                });

                it("should make the right ajax call", function() {
                    expect($.ajax.callCount).toEqual(1);
                    var req = $.ajax.mostRecentCall.args[0];
                    expect(req.type).toEqual("POST");
                    expect(req.url).toEqual(createEndpoint);
                    expect(req.data).toEqual(formData);
                });

                it("should show the tick and no count", function() {
                    expect(setSyncButtonCalls[1]).toEqual(['check', '&nbsp;']);
                    expect(pages.setSyncButton.mostRecentCall.args).toEqual(['check', '&nbsp;']);
                });

            });

            describe("with a failing change", function() {
                var handlers;

                beforeEach(function() {
                    handlers = []; // TODO: replace this with `.argsForCall[n]`
                    spyOn($, 'ajax').andCallFake(function(req) {
                        handlers.push({ success: req.success, error: req.error });
                    });

                    subject.persist("delete", formData);
                    handlers[0].error(jasmine.createSpy("ajaxEvent"));
                });

                it("should remember failed change", function() {
                    expect(pages.setSyncButton.mostRecentCall.args[1]).toEqual(1);
                });

                it("should show a retry icon when there are waiting (non-active) changes", function() {
                    expect(pages.setSyncButton.mostRecentCall.args[0]).toEqual('refresh');
                });

                it("should retry previously failed changes (as well as new one) on next #persist call", function() {
                    expect($.ajax.callCount).toEqual(1);
                    subject.persist("update", formData);
                    expect($.ajax.callCount).toEqual(3);
                });

                it("should handle old change succeeding, new failing", function() {
                    subject.persist("update", formData);
                    expect(pages.setSyncButton.mostRecentCall.args).toEqual(['pm-spinner', 2]);

                    handlers[handlers.length-2].success(jasmine.createSpy("ajaxEvent"));
                    expect(pages.setSyncButton.mostRecentCall.args).toEqual(['pm-spinner', 1]);

                    handlers[handlers.length-1].error(jasmine.createSpy("ajaxEvent"));
                    expect(pages.setSyncButton.mostRecentCall.args).toEqual(['refresh', 1]);
                });

            });

            describe("with an active change", function() {

                xit("should try the new change immediately (not just add and wait for ac)", function() {
                    spyOn($, 'ajax');
                    subject.persist("delete", formData);
                    expect($.ajax.callCount).toEqual(1); // first request made but not returned
                    subject.persist("update", formData);
                    expect($.ajax.callCount).toEqual(2); // second request
                });

            });

        }); // #persist

        describe("#processQueue", function() {

            describe("with one change waiting, one change active", function() {
                var handlers;

                beforeEach(function() {
                    handlers = [];
                    spyOn(window, 'alert');
                    spyOn($, 'ajax').andCallFake(function(req) {
                        handlers.push({ success: req.success, error: req.error });
                    });

                    subject.persist("delete", formData);
                    subject.persist("update", formData);
                    handlers[0].error(jasmine.createSpy("ajaxEvent"));

                    expect($.ajax.callCount).toEqual(2);
                });

                it("should retry changes that are not already (or still) active", function() {
                    subject.processQueue();
                    expect($.ajax.callCount).toEqual(3);
                });

            });

            describe("with no waiting or active changes", function() {
              
                it("should do nothing when invoked programatically", function() {
                    spyOn(window, 'alert');
                    spyOn($, 'ajax');
                    subject.processQueue();
                    expect(window.alert).not.toHaveBeenCalled();
                    expect($.ajax).not.toHaveBeenCalled();
                });

                it("should explain there are no unsynchronised changes when invoked manually", function() {
                    spyOn(window, 'alert');
                    subject.processQueue(true);
                    expect(window.alert.mostRecentCall.args[0]).toMatch(/no unsynchronised/);
                });

            });

        }); // #processQueue

    });

});

