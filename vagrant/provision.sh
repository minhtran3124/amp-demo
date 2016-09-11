#!/bin/bash
#
# provision.sh
#
# This file is specified in Vagrantfile and is loaded by Vagrant as the primary
# provisioning script whenever the commands `vagrant up`, `vagrant provision`,
# or `vagrant reload` are used. It provides all of the default packages .

# Variables
# ---------
echo '### Updating system ...'
sudo apt-get update -y
sudo apt-get -y install git-core python g++ make checkinstall zlib1g-dev zip curl

# NodeJS
# ------
echo '### Install nodejs ...'
git clone https://github.com/creationix/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`

source ~/.nvm/nvm.sh
echo "source ~/.nvm/nvm.sh" >> ~/.bashrc
echo "nvm use $NODE_VERSION" >> ~/.bashrc

nvm list
nvm ls-remote
nvm install 6.4.0
nvm use 6.4.0
nvm alias default 6.4.0
npm install -g npm

echo "Installing Gulp and Bower"
npm install bower gulp -g

# Install mongodb
# ---------------
echo '### Install MongoDB'
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" | sudo tee -a /etc/apt/sources.list.d/10gen.list
sudo apt-get -y update
sudo apt-get -y install mongodb-org
