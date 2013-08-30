define(["jquery", "js/config"], function($, config) {

    return function(pages, localStorage) {
        localStorage = typeof localStorage !== "undefined" ? localStorage : window.localStorage;

        var queues = { waiting: [], active: [] };

        var appId = config.appId(window.location.href);
        var localStorageKey = ["pozimobile", appId.client, appId.appName].join("-");

        var localStorageIsAvailable = function() {
            try {
                return typeof localStorage !== "undefined" && localStorage !== null;
            } catch (e) {
                return false;
            }
        };

        var backupQueues = function() {
            if (localStorageIsAvailable()) {
                try {
                    localStorage.setItem(localStorageKey, JSON.stringify(queues));
                } catch(e) {
                    alert(
                        "The web storage quota has been exceeded. Some unsynchronised changes"+
                        "may be lost if you close or reload the page!"
                    );
                }
            }
        };

        var restoreQueues = function() {
            if (localStorageIsAvailable()) {
                var data = localStorage.getItem(localStorageKey);
                if (data) {
                    var recoveredQueues = JSON.parse(data);
                    queues.waiting = recoveredQueues.waiting.concat(recoveredQueues.active);
                    backupQueues();
                    return true;
                }
            }
        };

        var doSync = function(item) {
            updateInterface();
            $.ajax({
                type: "POST", // TODO: use different verbs when server side is re-done
                url: config.data()[item.action+"Endpoint"],
                data: item.data,
                success: function(e) {
                    queues.active = _(queues.active).without(item);
                    backupQueues();
                    updateInterface();
                },
                error: function(e) {
                    queues.waiting.push(item);
                    queues.active = _(queues.active).without(item);
                    backupQueues();
                    updateInterface();
                }
            });
        };

        var unsyncdCount = function() {
            return queues.waiting.length + queues.active.length;
        };

        var nothingToSync = function() {
            return unsyncdCount() === 0;
        };

        var updateInterface = function() {
            var label = nothingToSync() ? "&nbsp;" : unsyncdCount();
            var icon;

            if (queues.active.length > 0) { icon = "pm-spinner"; }
            else if (nothingToSync()) { icon = "check"; }
            else { icon = "refresh"; }

            debugger;
            pages.setSyncButton(icon, label);

            if (nothingToSync()) { pages.updateData(); }
        };

        this.persist = function(action, data) {
            queues.waiting.push({ action: action, data: data });
            backupQueues();
            this.processQueue();
        };

        this.processQueue = function(manual) {
            var item;
            if (manual && nothingToSync()) {
                alert("There are no unsynchronised changes.");
            } else {
                while (item = _(queues.waiting).first()) {
                    queues.active.push(item);
                    queues.waiting = _(queues.waiting).without(item);
                    backupQueues();
                    doSync(item);
                }
            }
        };

        if (!localStorageIsAvailable()) {
            alert(
              "You browser is not providing web storage (localStorage). "+
              "If you close or reload the page, any unsynchronised changes will be lost!"
            );
        }

        if (restoreQueues()) {
            updateInterface();
        };

    };

});

