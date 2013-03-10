#!/bin/bash

(
    sleep 1
    open http://127.0.0.1:8080/jscoverage.html?SpecRunner.html
) &

jscoverage-server \
    --no-instrument=/lib \
    --no-instrument=/js/spec \
    --verbose


