# Homelab as a Service Bootstrap

CircleCI Build

[![CircleCI](https://circleci.com/gh/homelabaas/haas-bootstrap.svg?style=svg)](https://circleci.com/gh/homelabaas/haas-bootstrap)

Snyk Vulnerability Scan

[![Known Vulnerabilities](https://snyk.io/test/github/homelabaas/haas-bootstrap/badge.svg)](https://snyk.io/test/github/homelabaas/haas-bootstrap)

## Info

This will help you get started with [Homelab as a Service](https://homelabaas.io).

This application helps you through installation and setup for all the services you require to start the main Homelab as a Service application.

## Pre-requisites

You will need a machine running Docker. Docker for Mac, Docker for Windows and just straight docker on Linux will all work fine.

## Start Installation of HaaS

To get this up and running to start a Homelab as a Service installation, run:

```bash
docker run -v /var/run/docker.sock:/var/run/docker.sock -p 3010:3010 homelabaas/haas-bootstrap
```
