require(["requirejsConfig"], function() {
    require(["jquery", "pages"], function($, pages) {
        $(document).ready(function(){ pages.initAll(); });
    });
});

