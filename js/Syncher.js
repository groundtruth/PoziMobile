define(["jquery", "underscore", "js/config"], function($, _, config) {

    return function(pages, localStorage) {
        localStorage = typeof localStorage !== "undefined" ? localStorage : window.localStorage;

        var appId = config.appId(window.location.href);
        var localStorageKey = ["pozimobile", appId.client, appId.appName].join("-");

        var that = this;

        this.queues = { waiting: [], active: [] };

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
                    localStorage.setItem(localStorageKey, JSON.stringify(that.queues));
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
                    that.queues.waiting = recoveredQueues.waiting.concat(recoveredQueues.active);
                    backupQueues();
                    return true;
                }
            }
        };

        var doSync = function(item) {
            that.updateInterface();
            var geoJSON = JSON.stringify(item.data);
            var verb = {
                "create": "POST",
                "update": "PUT",
                "delete": "DELETE"
            }[item.action];
            var body = item.action === "delete" ? "" : geoJSON;
            var idSuffix = _(["update", "delete"]).contains(item.action) ? '/'+item.data.properties[config.data().idField] : '';
            $.ajax({
                type: verb,
                url: config.data().restEndpoint + idSuffix,
                data: body,
                success: function(e) {
                    that.queues.active = _(that.queues.active).without(item);
                    backupQueues();
                    that.updateInterface();
                },
                error: function(e) {
                    that.queues.waiting.push(item);
                    that.queues.active = _(that.queues.active).without(item);
                    backupQueues();
                    that.updateInterface();
                }
            });
        };

        var unsyncdCount = function() {
            return that.queues.waiting.length + that.queues.active.length;
        };

        var nothingToSync = function() {
            return unsyncdCount() === 0;
        };

        this.updateInterface = function() {
            var label = nothingToSync() ? "&nbsp;" : unsyncdCount();
            var icon;

            if (that.queues.active.length > 0) { icon = "pm-spinner"; }
            else if (nothingToSync()) { icon = "check"; }
            else { icon = "refresh"; }

            pages.setSyncButton(icon, label);

            if (nothingToSync()) { pages.updateData(); }
        };

        this.persist = function(action, data) {
            that.queues.waiting.push({ action: action, data: data });
            backupQueues();
            that.processQueue();
        };

        this.processQueue = function(manual) {
            var item;
            if (manual && nothingToSync()) {
                alert("There are no unsynchronised changes.");
            } else {
                while (item = _(that.queues.waiting).first()) {
                    that.queues.active.push(item);
                    that.queues.waiting = _(that.queues.waiting).without(item);
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

        restoreQueues();

    };

});

