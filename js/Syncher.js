define(["jquery", "js/config"], function($, config) {

    return function(pages) {

        var waitingQueue = [];
        var activeQueue = [];

        var doSync = function(item) {
            updateInterface();
            $.ajax({
                type: "POST", // TODO: use different verbs when server side is re-done
                url: config.data()[item.action+"Endpoint"],
                data: item.data,
                success: function(e) {
                    activeQueue = _(activeQueue).without(item);
                    updateInterface();
                },
                error: function(e) {
                    waitingQueue.push(item);
                    activeQueue = _(activeQueue).without(item);
                    updateInterface();
                }
            });
        };

        var unsyncdCount = function() {
            return waitingQueue.length + activeQueue.length;
        };

        var nothingToSync = function() {
            return unsyncdCount() === 0;
        };

        var updateInterface = function() {
            var label = nothingToSync() ? "&nbsp;" : unsyncdCount();
            var icon;

            if (activeQueue.length > 0) { icon = "pm-spinner"; }
            else if (nothingToSync()) { icon = "check"; }
            else { icon = "refresh"; }

            pages.setSyncButton(icon, label);

            if (nothingToSync()) { pages.updateData(); }
        };

        this.persist = function(action, data) {
            waitingQueue.push({ action: action, data: data });
            this.processQueue();
        };

        this.processQueue = function(manual) {
            var item;
            if (manual && nothingToSync()) {
                alert("There are no unsynchronised changes.");
            } else {
                while (item = _(waitingQueue).first()) {
                    activeQueue.push(item);
                    waitingQueue = _(waitingQueue).without(item);
                    doSync(item);
                }
            }
        };


    };

});

