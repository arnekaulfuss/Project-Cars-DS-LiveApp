module.exports = function (grunt) {
	grunt.registerTask('default', ['prompt', 'pcars_ds:start', 'compileAssets', 'linkAssets', 'watch']);
};
