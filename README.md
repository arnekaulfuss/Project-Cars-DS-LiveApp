# Project Cars DS Live App

## Warning
Don't use is for Production it's heavy in development!

## Description
With this App you can watch the Lap Times **Live** online and all Races will get stored on the Database for future evaluations.

## Installation

### Prerequisites
* NodeJS

### Download
Download the ZIP from GitHub and Upload / Unpack it to your Server.

Execute this Command in your LiveApp Folder.
```
npm install
```

### Configuration
Configure the LiveApp config/env/production.js

## Usage
Start the app with

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
// TODO

### Does it have multi Server Support?
No but it is planned
