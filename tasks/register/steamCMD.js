var fs = require('fs');
var path = require('path');

var exists = fs.existsSync;
var mkdir = fs.mkdirSync;
var chmod = fs.chmodSync;
var spawn = require('child_process').spawnSync; 

module.exports = function (grunt) {
  grunt.registerTask('steamCMD', 'Install steamcmd and pcars dedicated server', function () {
    if (!exists(path.resolve(__dirname, '../../steamcmd/pcars_ds/DedicatedServerCmd'))) {
      grunt.log.writeln('Going to try to install pcars dedicated server via steamcmd');
      grunt.log.writeln('Assumes a linux 64bit system with lib32 c compiler');
      grunt.log.writeln('If you\'re not on linux, be sure to install steamcmd and pcars manually within the "steamcmd" directory in this project');

      var steamDir = path.resolve(__dirname, '../../steamcmd');
      var scriptsDir = path.resolve(__dirname, '../../scripts');

      // install steamcmd
      spawn(scriptsDir + '/install_steamcmd.sh');
      grunt.log.writeln('Installed steam cmd');

      // install pcars_ds
      spawn(scriptsDir + '/install_pcars.sh');
      grunt.log.writeln('Installed project cars dedicated server');

    } 
    grunt.log.ok('steamcmd and pcars installed.');
  });
}