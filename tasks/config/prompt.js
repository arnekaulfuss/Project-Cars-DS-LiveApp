var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {

  grunt.config.set('prompt', {
    default: {
      options: {
        questions: [
          {
            config: 'local.db.user',
            type: 'input',
            default: 'root',
            message: 'MySQL user'
          }, {
            config: 'local.db.password',
            type: 'password',
            default: '',
            message: 'MySQL user password (hit enter for none)'
          }, {
            config: 'local.db.database',
            type: 'input',
            default: 'pcars',
            message: 'MySQL Database'
          }, {
            config: 'local.db.host',
            type: 'input',
            default: '127.0.0.1',
            message: 'MySQL host'
          }, {
            config: 'local.db.port',
            type: 'input',
            default: '3306',
            message: 'MySQL host'
          }, {
            config: 'local.app.name',
            type: 'input',
            default: 'Project Cars Live App',
            message: 'Name of your app'
          }, {
            config: 'local.app.host',
            type: 'input',
            default: 'localhost',
            message: 'Host (URL) of the app'
          }, {
            config: 'local.app.port',
            type: 'input',
            default: '1337',
            message: 'App port'
          }, {
            config: 'local.app.protocol',
            type: 'input',
            default: 'http://',
            message: 'App port'
          }
        ],
        then: function () {
          grunt.config.set('local.db.user', '');
          grunt.config.set('local.db.password', '');
          grunt.config.set('local.db.database', '');
          grunt.config.set('local.db.host', '');
          grunt.config.set('local.db.port', '');

          grunt.config.set('local.app.name', '');
          grunt.config.set('local.app.host', '');
          grunt.config.set('local.app.port', '');
          grunt.config.set('local.app.protocol', '');

          fs.writeFileSync(path.resolve(__dirname, '../../local.json'), JSON.stringify({
            local: grunt.config('local')
          }, null, 2), 'utf-8');
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-prompt');
};
