# Installation

This app requires a 64bit Debian/Ubuntu environment to run. If you're on OS X or Windows, I've included a vagrant file to easily spool up a 64bit Ubuntu vm.

### Using vagrant
[Install Vagrant](http://docs.vagrantup.com/v2/installation/index.html)

[Install Virtualbox](https://www.virtualbox.org/wiki/Downloads) (you can also use VMWare)

Clone the repo and install the vm
```
git clone <git repo> .
cd Project-Cars-DS-LiveApp
vagrant up
```

The server is installed with all necessary software. Log into the VM
```
vagrant ssh
```

It's worth noting that your code is shared from your host (OS X, Windows, etc) and placed in the `/vagrant` directory of the VM.

Install app dependencies
```
cd /vagrant
npm install
```

### Using your own Ubuntu/Debian 64bit machine

Clone the repo and cd into it
```
git clone <git repo> .
cd Project-Cars-DS-LiveApp
```

Update your server software (installs binaries and node dependencies)
```
sudo ./scripts/install_server_software.sh
```

Install app dependencies
```
npm install
```

### Updating your database credentials

By default, the setup creates a mysql database with a root user and no password, and a pcars table. It's important that you do not expose port 3306 with the setup. If you would prefer to use a different user/database, you can edit ```config/connections.js``` with your database info

# Usage

### Starting the server

Make sure you have port 80 and 1337 open on your server, or forwarded to your machine from your home router.

#### Run in development mode, on port 1337
```
npm run dev
```

#### Run in production mode, on port 80.
Note! This assumes you do not have any other applications on your server running on port 80. 
If you have, something like Apache, or Nginx installed and would like to proxy traffic via those apps, you might not want to run the next command, as it updates iptables and will route all traffic to and from port 80 to the node app.
```
npm run prod
```

### Create an admin account

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

### Personalize the site

Edit the file in /config/personnalConfig.js and change sitename/siteurl to your infos, and pagination limit if you want.



# TODO
### What are events?

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

### I don't love design can i modify it?

You will find in the Assets folder all Js/Css/Fonts/Less/Images used and all pages files are into /views. Your are allow to do all you want.


# Report bugs and features here [Project-cars forum thread](http://forum.projectcarsgame.com/showthread.php?33757-Project-Cars-Dedicated-Server-Live-App)
