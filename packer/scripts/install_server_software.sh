#!/bin/bash

# system software
apt-get update
apt-get install lib32gcc1 lib32stdc++6 git redis-server nodejs npm -y
export DEBIAN_FRONTEND=noninteractive
apt-get -q -y install mysql-server
apt-get autoremove -y

ln -s /usr/bin/nodejs /usr/bin/node
sudo npm install -g sails

echo "create database pcars;" | mysql -u root
