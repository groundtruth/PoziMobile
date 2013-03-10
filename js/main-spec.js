require(["requirejsConfig"], function() {
    require(["jquery", "jasmine-html", "spec/SpecList"], function($, jasmine) {

        var jasmineEnv = jasmine.getEnv();
        jasmineEnv.updateInterval = 250;

        var htmlReporter = jasmine.HtmlReporter.doNew();

        jasmineEnv.addReporter(htmlReporter);

        jasmineEnv.specFilter = function(spec) {
            return htmlReporter.specFilter(spec);
        };

        $(function(){
            jasmineEnv.execute();
        });

    });
});

