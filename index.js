require(["requirejsConfig"], function() {
    require(["jquery", "jquery.mobile", "js/Pages"], function($, jqm, Pages) {
        $(document).ready(function(){ Pages.doNew(); });
    });
});

