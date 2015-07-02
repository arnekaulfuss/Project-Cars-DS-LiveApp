/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

    //Base route
    '/': 'PagesController.home',

    // Admin routes
    '/admin' : 'AdminController.dashboard',
    '/adminConnect': 'AdminController.adminConnect',


    // Drivers routes
    '/admin/drivers': 'DriverController.adminIndex',
    '/admin/driver/edit/:id': {
        controller: 'DriverController',
        action: 'edit',
        skipAssets: true
    },
    '/drivers': {
        controller: 'DriverController',
        action: 'index'
    },
    '/driver/:id': {
        controller: 'DriverController',
        action: 'view'
    },

    // Cars Admin routes
    '/admin/cars': 'CarController.index',
    '/admin/cars/:id': {
        controller: 'CarController',
        action: 'edit',
        skipAssets: true
    },
    // Events Admin routes
    '/admin/events': 'EventController.indexAdmin',
    '/admin/events/add': 'EventController.add',
    '/admin/events/:id': {
        controller: 'EventController',
        action: 'edit',
        skipAssets: true
    },
    '/events/:id': {
        controller: 'EventController',
        action: 'show',
        skipAssets: true
    },
    '/events': {
        controller: 'EventController',
        action: 'index',
        skipAssets: true
    },

    // Track Admin routes
    '/admin/tracks': 'TrackController.index',
    '/admin/tracks/:id': {
        controller: 'TrackController',
        action: 'edit',
        skipAssets: true
    },

    // Track Admin routes
    '/admin/sessions': 'SessionsController.index',
    '/admin/sessions/:id': 'SessionsController.delete',


    // user routes
    'get /login': { view: 'user/login' },
    'get /signup': { view: 'user/signup' },
    'get /reset': 'UserController.pass',
    'post /reset': 'UserController.passwordReset',
    '/welcome': { view: 'user/welcome' },
    '/profile': 'UserController.profile',
    'post /login': 'UserController.login',
    'post /signup': 'UserController.signup',

    '/logout': 'UserController.logout',




    // livetiming views routes
    'get /live': {
        view: 'livetiming/live'
    },

    '/bestlaps' : 'LivetimingController.bestlapsView',
    'get /bst': 'LivetimingController.bestlapsQuery',

    '/results' : 'LivetimingController.resultsIndex',
    '/result/:id' : 'LivetimingController.resultsView',
    'get /res': 'LivetimingController.resultsQuery',

    'get /getLiveData': 'LivetimingController.getLiveData',
    '/stats': 'LivetimingController.stats',

    // livetiming actions routes
    '/start': 'ServerController.start',
    '/stop': 'ServerController.stop',
    '/upd': 'ServerController.updateTracksAndCar',
    '/updCars': 'ServerController.updateCars',
    '/admin/server': 'ServerController.admin'


  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/


};
