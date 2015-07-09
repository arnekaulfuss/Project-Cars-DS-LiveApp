# Installation

This app requires a 64 bit linux environment to run. If you're on OS X or Windows, I've included a vagrant file to easily spool up a 64bit Ubuntu vm.

## Using Vagrant
[Install Vagrant](http://docs.vagrantup.com/v2/installation/index.html)

[Install Virtualbox](https://www.virtualbox.org/wiki/Downloads) (you can also use VMWare)

Clone the repo and install the vm
```
git clone <git repo> .
cd Project-Cars-DS-LiveApp
vagrant up
```

Log into the VM
```
vagrant ssh
```

It's worth noting that your code is shared from your host (OS X, Windows, etc) and placed in the `/vagrant` directory of the VM.

## Using your own Ubuntu/Debian 64bit machine

Clone the repo and cd into it
```
git clone <git repo> .
cd Project-Cars-DS-LiveApp
```

Update your server software (installs binaries and node dependencies)
```
sudo ./scripts/install_server_software.sh
```

## Install app dependencies
```
npm install
```

## Updating your database credentials

# Usage

## Starting the server

Run the server in development mode, on port 1337
```
npm run dev
```

Start the server in production mode, on port 80.
Note! This assumes you do not have any other applications on your server running on port 80. 
If you have, something like Apache, or Nginx installed and would like to proxy traffic via those apps, you might not want to run the next command, as it updates iptables and will route all traffic to and from port 80 to the node app.
```
npm run prod
```


> !!! IMPORTANT SECURITY  REPLACEMENT !!!

Edit the file in /config/session.js, and change the secret security key

- Clan/team website infos

Edit the file in /config/personnalConfig.js and change sitename/siteurl to your infos, and pagination limit if you want.

## Usage

### Launch the server

> !!! CLOSE THE PROJECT CARS DEDICATED SERVER FIRST, BEFORE LIFT !!!

The better way to run the app, is like pcars dedicated server, with screen on linux:

	screen
	cd /Path/to/the/Project
	sails lift --prod

 - Press ctrl­+a  to detach from the screen.
 - Press ctrl+­d to leave the screen

command line:

lift the server with the production environment spec.  " No debug - minified file  -  ...".
```
    sails lift --prod
```

lift the server with the development environment spec. "debug  - not minified file - ..."
```
    sails lift
```

You can configure by environment some server infos like:
 1. Port used
 2. log level
 3. models connection

### First lift and admin account

> If the 80 port is already used by "apache-..." try to lift the server
> with another port

- First go to: http://yourdomain.com:port_specified_in_environment/signup

- Create an account and close the server with ctrl+c

- Go to /config/route.js and comment lines:
	`//'get /signup': { view: 'user/signup' },
    //'post /signup': 'UserController.signup',
	`
For this first release, all account have acces to admin panel http://yourdomain.com:port_specified_in_environment/login.
*On near future, admin access will be granted with role rules.*

- Lift the server again, and click to the arrow down on the top menu and click on admin.
- Go to the admin panel -> Server -> and update tracks / group / car step by step. Don't start the listener now!
- Go to server and start the listener
- Run the Project Cars dedicated server!

## What'is Events?

> NEED TO BE FIX

The events were created, so that when the session that matches the specifications of it , all will be recorded associated with the event. This will ensure fair competition conditions when hotlap for example.

- Go to admin panel, create one, and when you create a session in game be sure you are using the same conditions. the listener match if is identical:
-  servername,
- weather conditions *slot1, slot2, slot3, slot4*,
- date Ingame,
- between start and end date,
- DamageType,
- TireWearType,
- FuelUsageType,
- Track,
- Car group,
- DateProgression,
- ForecastProgression

## I don't love design can i modify it?

You will find in the Assets folder all Js/Css/Fonts/Less/Images used and all pages files are into /views. Your are allow to do all you want.


PS: The app is still in beta, if you found a bug, report them here or in [Project-cars forum thread](http://forum.projectcarsgame.com/showthread.php?33757-Project-Cars-Dedicated-Server-Live-App)
