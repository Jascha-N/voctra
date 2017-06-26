#!/bin/bash

set -xe

# Install dependencies
sudo apt-get update
sudo apt-get install -y rsync nginx-full

sudo rsync -v /vagrant/staging/nginx.conf /etc/nginx/nginx.conf
sudo systemctl reload nginx

sudo dpkg -i /vagrant/build/voctra_0.1.0_amd64.deb
