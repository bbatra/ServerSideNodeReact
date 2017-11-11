#!/bin/sh

Docker build . -t your-app-name

docker run -d -p 8080:8080 your-app-name