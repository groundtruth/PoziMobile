define(["jquery", "config"], function($, config) {

    return function(mainPage) {

        var queue = [];
        var requestCount = 0;

        var doSync = function(item) {
            requestCount++;
            updateInterface();
            $.ajax({
                type: "POST", // TODO: use different verbs when server side is re-done
                url: config[item.action+"Endpoint"],
                data: item.data,
                success: function(e) {
                    requestCount--;
                    updateInterface();
                },
                error: function(e) {
                    queue.push(item);
                    requestCount--;
                    updateInterface();
                }
            });
        };

        var updateInterface = function() {
            var icon;
            if (requestCount > 0) { icon = "pm-spinner"; }
            else if (queue.length === 0) { icon = "check"; }
            else { icon = "refresh"; }
            mainPage.setSyncButton(icon, queue.length);
            if (requestCount === 0 && queue.length === 0) {
               mainPage.updateData();
            }
        };

        this.persist = function(action, data) {
            queue.push({ action: action, data: data });
            this.processQueue();
        };

        this.processQueue = function(manual) {
            var item;
            if (manual && queue.length === 0) {
                alert("There are no unsynchronised changes.");
            } else if (requestCount > 0) {
                // if (manual) { alert("Already attempting to synchronise."); }
            } else {
                while (item = queue.shift()) { doSync(item); }
            }
        };


    };

});

