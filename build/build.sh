#!/bin/bash

set -xe

# Synchronize files
rsync -av --exclude='/.git' --filter='dir-merge,- .gitignore' /vagrant/ ~/voctra/
cd ~/voctra

# Fix permissions
chmod +x debian/rules

# Build package
debuild -us -uc -b

mkdir -p /vagrant/build/out
rsync -av ~/voctra_0.1.0_amd64.* /vagrant/build/out/
