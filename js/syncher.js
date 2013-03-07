define(["jquery", "config"], function(jquery, config) {

    var submitForm = function(data, endpoint) {
        $.ajax({
            type: "POST",
            url: endpoint,
            data: data,
            // success: function(e) { history.back(); },
            error: function(e) { alert("Could not successfully save the record."); }
        });
        return false;
    };

    return {

        doUpdate: function(opts) {
            submitForm(opts.data, config.updateEndpoint);
            opts.after();
        },

        doCreate: function(opts) {
            submitForm(opts.data, config.createEndpoint);
            opts.after();
        },

        doDelete: function(opts) {
            $.ajax({
                type: "POST", // TODO: this should become a DELETE action when the server-side stuff is redone
                url: config.deleteEndpoint,
                data: opts.data,
                // success: function(e) { history.back(); },
                error: function(e) { alert("Could not successfully delete the record."); }
            });
            opts.after();
        }

    };

});

