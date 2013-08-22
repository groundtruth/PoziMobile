#!/bin/bash

(
    sleep 1
    grunt jasmine::build
    open http://127.0.0.1:8080/jscoverage.html?_SpecRunner.html
) &

jscoverage-server \
    --no-instrument=/lib \
    --no-instrument=/spec \
    --no-instrument=.grunt \
    --verbose


