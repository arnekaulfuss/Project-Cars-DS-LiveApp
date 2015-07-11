#!/bin/bash

echo "attempting to set firewall rule to forward port 80 to port 13370"
echo "this allows us to have access to port 80, but not require the app to run as root"
echo "requires sudo priveleges to update"
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 13370
echo "success"
