#!/bin/bash

set -xe

# Install tools
sudo apt-get update
sudo apt-get install -y curl rsync

# Set up node repository
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

# Set up yarn repository
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo 'deb https://dl.yarnpkg.com/debian/ stable main' | sudo tee /etc/apt/sources.list.d/yarn.list

# Install packages
sudo apt-get update
## node/yarn (0.21.3-1, because latest is broken with debuild/fakeroot)
sudo apt-get install -y nodejs yarn=0.21.3-1
## diesel (build) dependencies
sudo apt-get install -y pkg-config libsqlite3-dev
## debian package build scipts
sudo apt-get install -y devscripts dh-systemd

# Install rustup, rustc and cargo
curl https://sh.rustup.rs -sSf | sh -s -- -y --default-toolchain nightly
source $HOME/.cargo/env

echo "DEBUILD_PREPEND_PATH=$HOME/.cargo/bin" > .devscripts
