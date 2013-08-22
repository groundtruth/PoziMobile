require(["js/requirejsConfig"], function() {
    require(["jquery", "jquery.mobile", "Pages"], function($, jqm, Pages) {
        $(document).ready(function(){ Pages.doNew(); });
    });
});

