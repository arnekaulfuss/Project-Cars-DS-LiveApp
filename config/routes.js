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
    //Base route
    '/': 'PagesController.home',

    /***************************************************************************
     *                                                                          *
     * Admin END ROUTES                                                         *
     *                                                                          *
     ***************************************************************************/

    // Admin base routes
    '/admin' : 'AdminController.dashboard',
    '/adminConnect': 'AdminController.adminConnect',

    // Admin Drivers routes
    '/admin/drivers': 'DriverController.adminIndex',
    '/admin/drivers/:page': 'DriverController.adminIndex',
    'get /admin/driver/edit/:id': 'DriverController.edit',
    'post /admin/driver/edit/:id': 'DriverController.update',
    // Cars Admin routes
    '/admin/cars': 'CarController.index',
    '/admin/cars/:page': 'CarController.index',
    '/admin/cars/edit/:id': 'CarController.edit',
    // Events Admin routes
    '/admin/events': 'EventController.indexAdmin',
    '/admin/events/:page': 'EventController.indexAdmin',
    'get /admin/event/add': 'EventController.add',
    'post /admin/event/add': 'EventController.create',
    'get /admin/event/edit/:id': 'EventController.edit',
    'post /admin/event/edit/:id': 'EventController.update',
    // Track Admin routes
    '/admin/tracks': 'TrackController.index',
    '/admin/tracks/:page': 'TrackController.index',
    'get /admin/track/:id': 'TrackController.edit',
    'post /admin/track/:id': 'TrackController.update',
    // Sessions Admin routes
    '/admin/sessions': 'SessionsController.index',
    '/admin/sessions/:page': 'SessionsController.index',
    '/admin/sessions/:id': 'SessionsController.delete',

    // Laps Admin routes
    '/admin/laps': 'LapController.adminIndex',
    '/admin/laps/:page': 'LapController.adminIndex',
    '/admin/lap/:id': 'LapController.delete',

    /***************************************************************************
     *                                                                          *
     * FRONT END ROUTES                                                         *
     *                                                                          *
     ***************************************************************************/

    //Driver front routes
    '/drivers': 'DriverController.index',
    '/drivers/:page': 'DriverController.index',
    '/driver/:id': 'DriverController.view',
    //Events front routes
    '/event/:id': 'EventController.show',
    '/events': 'EventController.index',
    '/events/:page': 'EventController.index',
    // user routes
    'get /login': { view: 'User/login' },
    'post /login': 'UserController.login',
    //Comment signup routes after create admin account
    'get /signup': { view: 'User/signup' },
    'post /signup': 'UserController.signup',
    'get /reset': 'UserController.pass',
    'post /reset': 'UserController.passwordReset',
    '/welcome': { view: 'User/welcome' },
    'get /profile': 'UserController.profile',
    'post /profile': 'UserController.update',
    '/logout': 'UserController.logout',
    // livetiming views routes
    'get /live': { view: 'Livetiming/live' },

    '/bestlaps' : 'LivetimingController.bestlapsView',
    'get /bst': 'LivetimingController.bestlapsQuery',

    '/results' : 'LivetimingController.resultsIndex',
    '/results/:page' : 'LivetimingController.resultsIndex',
    '/result/:id' : 'LivetimingController.resultsView',
    'get /res': 'LivetimingController.resultsQuery',
    'get /getLiveData': 'LivetimingController.getLiveData',
    '/stats': 'LivetimingController.stats',
    // Listener actions routes
    '/start': 'ServerController.start',
    '/stop': 'ServerController.stop',
    '/upd': 'ServerController.updateTracksAndCar',
    '/updCars': 'ServerController.updateCars',
    '/admin/server': 'ServerController.admin'

};
