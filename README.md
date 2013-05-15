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


## GPS troubleshooting

There are several resources that may be useful in troubleshooting GPS accuracy issues on iOS.

### Documentation and discussion

Apple's advice about Location Services and related settings:
[iOS 6: Understanding Location Services](http://support.apple.com/kb/HT5467).

Apple's [CoreLocation API documentation](https://developer.apple.com/library/ios/#documentation/UserExperience/Conceptual/LocationAwarenessPG/CoreLocation/CoreLocation.html)
shows that different levels of accuracy can be requested. There's a
[related discussion on YCominator](https://news.ycombinator.com/item?id=1526664).
It's not clear exactly how different browers handle this, but one would assume that
`enableHighAccuracy` would correspond to a higher level.

This blog post gives some background: [HTML5 Geolocation API – how accurate is it, really?](http://www.andygup.net/html5-geolocation-api-%E2%80%93-how-accurate-is-it-really/).

### GPS diagnostic apps

There are several free iOS apps that provide information about location services and may be useful diagnostic tools:

* [GPS Info!](https://itunes.apple.com/us/app/gps-info!/id333178016)
  shows various GPS status info, including location method (GPS, cell, wifi) and time since last update.
  
* [GPS Status](https://itunes.apple.com/app/gps-status/id378085995)
  shows some GPS fix information.

As well as paid apps:

* [GPS Info](https://itunes.apple.com/app/id321180147) ($0.99)
  shows status information including signal strength (probably derived from accuracy).

* [GPS Data](https://itunes.apple.com/us/app/gps-data/id319026538) ($0.99)
  may show some relevant GPS details.

* [MotionX GPS](https://itunes.apple.com/us/app/motionx-gps/id299949744) ($0.99)
  shows accuracy in meters and signal strength (not number of satellites - probably derived from accuracy). 
  It can be set to use GPS only (no WiFi/cellular).

* [GPS 2 IP](http://www.capsicumdreams.com/iphone/gps2ip/) ($6.99)
  serves GPS data from an iOS device in a raw format ([NMEA](http://en.wikipedia.org/wiki/NMEA_0183))
  that can be easily read by an external computer (via netcat, telnet, etc.).

### Devices for enhanced GPS performance

[Bad Elf](http://bad-elf.com/) sells devices ($130-$180) for enhanced GPS performance on iOS.
Their free app only shows status info when connected to one of their devices. The higher end
device has its own display that shows detailed status information.


