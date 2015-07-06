
# Project-Cars Dedicated Server Live App

## Installation



- Install [NodeJs](https://nodejs.org/)	

> !!! Be sure you have access to npm command line !!!

`npm -v`

will return the npm version

 - Install [Sails](http://sailsjs.org/) 
 
`npm install sails -g`

- Update the project
 
After you have "cloned / unzip the package" to your dedicated server or your local machine, run:

`cd /folder/you/had/copy/the/project & npm update`

Node will install all dependencies

- Prepare the database

Create a database, like "pcars" and be sure your mysql user have all grant access to it, when you will lift the app all table will be created.

Edit the file in: /config/connection.js with your database-infos into 'Mysql' object or if you want to use an other adaptater like mongoDB, don't forget to change the adaptater used into /config/models.js and /config/env/production.js


> !!! IMPORTANT SECURITY  REPLACEMENT !!!

Edit the file in /config/session.js, and change the secret security key

- Clan/team website infos

Edit the file in /config/globals.js and change sitename/siteurl to your infos.

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
- "sails lift --prod" -> will lift the server with the production environment spec.  " No debug - minified file  -  ...".
- "sails lift" -> will lift the server with the devellopement environment spec. "debug  - not minified file - ..."

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

### What'is Events?

> NEED TO BE FIX

The events were created, so that when the session that matches the specifications of it , all will be recorded associated with the event. This will ensure fair competition conditions when hotlap for example.

- Go to admin panel, create one, and when you create a session in game be sure you are using the same conditions. the listener match if is identical:
	- servername,
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


PS: The app is still in beta, if you found a bug, report them here or in [Project-cars forum thread](http://forum.projectcarsgame.com/showthread.php?33757-Project-Cars-Dedicated-Server-Live-App)