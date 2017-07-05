#!/bin/bash

set -xe

# Install dependencies
apt-get update
apt-get install -y rsync nginx-full ssl-cert

rsync -av /vagrant/staging/voctra.dev /etc/nginx/sites-available/voctra.dev
if [ -f /etc/nginx/sites-enabled/default ]; then
    rm -f /etc/nginx/sites-enabled/default
fi
if [ ! -f /etc/nginx/sites-enabled/voctra.dev ]; then
    ln -s /etc/nginx/sites-available/voctra.dev /etc/nginx/sites-enabled/voctra.dev
fi
systemctl reload nginx

dpkg -i /vagrant/build/out/voctra_0.1.0_amd64.deb
