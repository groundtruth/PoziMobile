# PoziMobile

A mobile-optimised web app for collection of location-related data.

[![Build Status](https://travis-ci.org/groundtruth/PoziMobile.png?branch=master)](https://travis-ci.org/groundtruth/PoziMobile)
[![Code Climate](https://codeclimate.com/github/groundtruth/PoziMobile.png)](https://codeclimate.com/github/groundtruth/PoziMobile)


## External dependencies

PoziMobile is a browser-based app that depends on a separate web service to
handle server-side querying and persistence.
[RestfulGeof](http://github.com/groundtruth/restful_geof) is that web service.


## Deployment

This repository should be served as static files from the same webserver that
hosts the web services.

At Groundtruth we can deploy the last version pushed to GitHub by running
`./deploy.sh`.


## Configuration

This repository tracks the PoziMobile application in a generic form. As such
it contains a single demonstration configuration file. Additional,
application-specific configuration is expected to be found in a `config/`
subdirectory. This may be done by cloning a repository of configuration into
that location, or by making `config` a link to a directory where configuration
is maintained.


## To do

* Have data layer refreshed after change (can currently return just before).
* Refactor `Syncher` and friends so that:
  - `Syncher` maintains its status info which is relevant to the interface.
  - `Syncher` does not know about the `Main` page.
  - the `Main` page can ask the `Syncher` for its status.
  - the `Syncher` can fire an event about a status change which the `Main`
    page may listen for.
* Add [coveralls.io](https://coveralls.io/) to track coverage.


## Run the unit tests

We are using Jasmine for unit testing, but have set it up to run from the
command line so that we can have automated, continuous testing done on
[TravisCI](https://travis-ci.org/groundtruth/PoziMobile).

Before running the tests locally, you'll need to install:

* [PhantomJS](http://phantomjs.org/download.html)
* [Node.js](http://nodejs.org/download/)
* [Grunt](http://gruntjs.com/getting-started): `npm install -g grunt-cli`
* this project's node modules: `npm install`

Now you're ready to run the tests:

    grunt jasmine          # run the tests in the console
    grunt jasmine -v       # with more verbose output

    grunt jasmine::build   # this generates _SpecRunner.html

By opening the `_SpecRunner.html` file in the browser (it's important to do
this via a web server), you can run the specs directly, without Grunt. This
can be useful when debugging. Note that the `_SpecRunner.html` file will
need to be regenerated if you change the name of any spec file.


## Check code coverage

To check code coverage, follow the testing steps above, then install
[JSCoverage](http://siliconforks.com/jscoverage/manual.html)
(e.g. `brew update && brew install jscoverage`) and run `./coverage.sh`.

In the future it may be worth switching to [JSCover](http://tntim96.github.com/JSCover/)
(a updated version, rewritten in Java instead of C++), or
[Istanbul](https://github.com/gotwarlost/istanbul) (a Node.js-based coverage tool).


## Full stack testing with WebDriver and PhantomJS, in JavaScript

It's possible. See the tests for PoziExplorer to get started.


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


