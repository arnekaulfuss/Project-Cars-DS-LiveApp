#!/bin/bash

# system software
apt-get update
curl --silent --location https://deb.nodesource.com/setup_0.12 | bash -
apt-get install lib32gcc1 lib32stdc++6 git redis-server nodejs build-essential htop -y
export DEBIAN_FRONTEND=noninteractive
apt-get -q -y install mysql-server
apt-get autoremove -y

ln -s /usr/bin/nodejs /usr/bin/node
npm install npm -g
npm install -g sails grunt-cli

echo "create database pcars;" | mysql -u root
