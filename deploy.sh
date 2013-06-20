#!/bin/bash -x

ssh root@general.pozi.com "cd /var/lib/tomcat6/webapps/PoziMobile && git pull origin master"

