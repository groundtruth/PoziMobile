define(["jquery", "config"], function($, config) {

    return function(pageWithButton) {

        var queue = [];
        var requestCount = 0;

        var processQueue = function() {
            var item;
            while (item = queue.shift()) { doSync(item); }
        };

        var doSync = function(item) {
            requestCount++;
            updateSyncButton();
            $.ajax({
                type: "POST", // TODO: use different verbs when server side is re-done
                url: config[item.action+"Endpoint"],
                data: item.data,
                success: function(e) {
                    requestCount--;
                    updateSyncButton();
                },
                error: function(e) {
                    queue.push(item);
                    requestCount--;
                    updateSyncButton();
                }
            });
        };

        var updateSyncButton = function() {
            var icon;
            if (requestCount > 0) { icon = "pm-spinner"; }
            else if (queue.length === 0) { icon = "check"; }
            else { icon = "refresh"; }
            pageWithButton.setSyncButton(icon, queue.length);
        };

        this.persist = function(action, data) {
            queue.push({ action: action, data: data });
            processQueue();
        };

    };

});

