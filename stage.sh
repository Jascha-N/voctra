#!/bin/bash

set -xe

# Start build vm and build .deb package
vagrant up build
vagrant ssh build -c 'bash /vagrant/build/build.sh'

# Start staging vm
vagrant up --provision staging
