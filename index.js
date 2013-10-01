require(["requirejsConfig"], function() {
    require(["jquery", "jquery.mobile", "js/Pages"], function($, jqm, Pages) {
        $(document).ready(function(){
            if (!window.startedPoziMobile) {
                Pages.doNew();
                window.startedPoziMobile = true;
            }
        });
    });
});

