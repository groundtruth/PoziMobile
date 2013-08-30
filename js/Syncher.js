define(["jquery", "js/config"], function($, config) {

    return function(pages) {

        var queues = { waiting: [], active: [] };

        var backupQueues = function() {
            localStorage.setItem("key", JSON.stringify(queues));
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

    };

});

