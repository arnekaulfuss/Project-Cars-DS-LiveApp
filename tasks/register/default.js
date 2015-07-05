module.exports = function (grunt) {
	grunt.registerTask('default', ['steamCMD', 'compileAssets', 'linkAssets',  'watch']);
};
