#!/bin/bash

set -xe

# Synchronize files
rsync -rtv --chmod=D775,F664 --exclude='/.git' --filter='dir-merge,- .gitignore' /vagrant/ ~/voctra/
cd ~/voctra

# Fix permissions
chmod +x debian/rules

# Build package
debuild -us -uc -b

cd
rsync -av voctra_0.1.0_amd64.deb /vagrant/build
