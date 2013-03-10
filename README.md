# PoziMobile

A mobile-optimised web app for collection of location-related data.

## External dependencies

PoziMobile depends on some small web services to handle server-side persistence.

## Deployment

This repository should be served as static files from the same webserver that
hosts the web services.

## Run the unit tests

Just open `SpecRunner.html` (via a web server).

# Check code coverage

To check code coverage, install [JSCoverage](http://siliconforks.com/jscoverage/manual.html)
(e.g. `brew update && brew install jscoverage`) and run `./coverage.sh`.

In the future it may be worth switching to [JSCover](http://tntim96.github.com/JSCover/)
(a updated version, rewritten in Java instead of C++).

