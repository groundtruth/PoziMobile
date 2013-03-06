define(["jquery", "config"], function(jquery, config) {

    var submitForm = function(formdata, endpoint) {
        $.ajax({
            type: "POST",
            url: endpoint,
            data: formdata,
            success: function(e) { history.back(); },
            error: function(e) { alert("Could not successfully save the record."); }
        });
        return false;
    };

    return {

        doUpdate: function(formdata) {
            submitForm(formdata, config.updateEndpoint);
        },

        doCreate: function(formdata) {
            submitForm(formdata, config.createEndpoint);
        },

        doDelete: function(formdata) {
            $.ajax({
                type: "POST", // TODO: this should become a DELETE action when the server-side stuff is redone
                url: config.deleteEndpoint,
                data: formdata,
                success: function(e) { history.back(); },
                error: function(e) { alert("Could not successfully delete the record."); }
            });
            return false;
        }

    };

});

