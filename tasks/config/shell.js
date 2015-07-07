module.exports = function (grunt) {
  grunt.config.set('shell', {
    pcars_ds_start: {
      command: './scripts/start_pcars_ds.sh',
      options: {
        async: true,
        failOnError: true,
        canKill: true,
        stdout: true,
        stderr: true
      }
    },
    pcars_ds_kill: {
      command: 'killall DedicatedServerCmd',
      options: {
        async: false,
        failOnError: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell-spawn');
};
