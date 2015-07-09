var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var request = require('request');

var pcarsOptions = require('../../config/pcars_ds/server_options.js');
var spawn = require('../../api/services/spawn.js');

var exists = fs.existsSync;
var read = fs.readFileSync;
var write = fs.writeFileSync;

module.exports = function (grunt) {

  var server_path             = path.resolve(__dirname, '../../steamcmd/pcars_ds/server.cfg');
  var blacklist_path          = path.resolve(__dirname, '../../steamcmd/pcars_ds/blacklist.cfg');
  var whitelist_path          = path.resolve(__dirname, '../../steamcmd/pcars_ds/whitelist.cfg');
  var server_template_path    = path.resolve(__dirname, '../../config/pcars_ds/server.cfg.template');
  var blacklist_template_path = path.resolve(__dirname, '../../config/pcars_ds/blacklist.cfg.template');
  var whitelist_template_path = path.resolve(__dirname, '../../config/pcars_ds/whitelist.cfg.template');

  grunt.registerTask('pcars_ds:is_installed', function () {
    if (!pcars_is_installed()) return grunt.fail.fatal('Pcars dedi server is not installed. Install with "npm install"');
    grunt.log.ok('steamcmd and pcars are both installed, continuing.');
  });

  grunt.registerTask('pcars_ds:reapply_cfg', 're-apply\'s the configuration for the dedicated server', function () {

    var server    = _.template(read(server_template_path));
    var blacklist = read(blacklist_template_path);
    var whitelist = read(whitelist_template_path);


    request('http://ipinfo.io', function (e, res, data) {
      if (!e && res.statusCode == 200) {
        data = JSON.parse(data);
        pcarsOptions.name = pcarsOptions._name([data.country, data.city, pcarsOptions._siteName].join('-'))
      }

      write(server_path, server(pcarsOptions));
    });
    
    write(blacklist_path, blacklist);
    write(whitelist_path, whitelist);

    grunt.log.ok('server configs re-applied successfully, continuing.');
  });

  grunt.registerTask('pcars_ds:run_server', 'starts the pcars dedi server', function () {
    var logName = 'pcars.log';
    spawn(path.resolve(__dirname, '../../scripts/start_pcars_ds.sh'), [], logName).catch(function () {
      grunt.fail.fatal('non-zero exit code from pcars.')
    });

    grunt.log.ok('dedicated server started. outputting logs to ' + path.resolve(__dirname, '../../log/' + logName));
  });

  grunt.registerTask('pcars_ds:start', [
    'shell:pcars_ds_kill',
    'pcars_ds:is_installed',
    'pcars_ds:reapply_cfg',
    'pcars_ds:run_server'
  ]);

  // 'shell:pcars_ds_start'

  /*==========  ...  ==========*/

  function steamcmd_is_installed () {
    return exists(path.resolve(__dirname, '../../steamcmd/steam.sh'));
  }

  function pcars_is_installed () {
    return steamcmd_is_installed() && exists(path.resolve(__dirname, '../../steamcmd/pcars_ds/DedicatedServerCmd'));
  }
}
