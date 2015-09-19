module.exports = function(grunt) {
  grunt.registerTask('default', ['prompt', 'compileAssets', 'linkAssets', 'watch']);
};
