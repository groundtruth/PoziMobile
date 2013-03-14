# PoziMobile

A mobile-optimised web app for collection of location-related data.

## External dependencies

PoziMobile depends on some small web services to handle server-side persistence.

## Deployment

This repository should be served as static files from the same webserver that
hosts the web services. Running `./deploy.sh` should redeploy the last version
pushed to GitHub.

## Run the unit tests

Just open `SpecRunner.html` (via a web server).

## Check code coverage

To check code coverage, install [JSCoverage](http://siliconforks.com/jscoverage/manual.html)
(e.g. `brew update && brew install jscoverage`) and run `./coverage.sh`.

In the future it may be worth switching to [JSCover](http://tntim96.github.com/JSCover/)
(a updated version, rewritten in Java instead of C++).

## Full stack testing with WebDriver and PhantomJS, in JavaScript

It's possible. Here are some notes to help get started.

    brew update
    brew install node
    brew install phantomjs

    npm install selenium-webdriver
    open https://code.google.com/p/selenium/wiki/WebDriverJs
    open https://npmjs.org/package/selenium-webdriver

    phantomjs --webdriver=4444 &
    node <<< '
        var webdriver = require("selenium-webdriver");
        var driver = new webdriver.Builder().build();
        var fs = require("fs");

        driver.get("http://www.google.com");
        driver.findElement(webdriver.By.name("q")).sendKeys("webdriver");
        driver.takeScreenshot().then(function(data){
            fs.writeFile("screenshot.png", data, "base64", function(err) {
                if(err) { console.log(err); }
                else { console.log("Saved a screenshot."); }
            });
        });
        driver.quit();
    '
    killall phantomjs

    open screenshot.png

    open https://npmjs.org/package/webdriverjs # alternative JS bindings for webdriver

