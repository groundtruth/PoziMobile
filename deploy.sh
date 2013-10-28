#!/bin/bash -x

ssh root@general.pozi.com "cd /var/lib/tomcat6/webapps/PoziMobile && git pull origin master && cd config && git reset --hard && git pull origin master"

