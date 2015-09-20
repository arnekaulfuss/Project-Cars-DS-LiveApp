# Project Cars DS Live App

## Warning
If you are looking for a "ready to use" and "hassle-free" statistic tool ... THIS IS NOT FOR YOU!
This is not intended to be used in an production environment, because it is in an early state of development / redesign.

## Description
With this App you can watch the Lap Times **Live** online and all Races will get stored on the Database for future evaluations.

## Installation

### Prerequisites
* working pCARS dedicated server
* working NodeJS installation
* basic knowledge of your server environment

### Download
* Download the ZIP from GitHub and upload / unpack it to your server.
* Execute "npm install" in your LiveApp folder to fetch the needed node packages.

```
npm install
```

### Configuration
Configure the LiveApp by editing the file "config/env/production.js"

## Usage
Start the app in production mode with:

```
sails lift --prod
```

## FAQ

### How can i create an Admin Account?
Connect to your Database and set the Column **"admin"** in the User Table to **"true"** for the specific User.

### How can i Debug the App?
Configure config/env/development.js and start the App with

```
sails lift
```

### What are Events?
Events are a NOT YET FUNCTIONAL part of the project.
The idea is having summary of a series of races matching specific predefined adjustments.
This is intended to be the basis for racing league statistics.

### Does it have multi Server Support?
NO, not yet but it is work in progress.
