module.exports = function (grunt) {
	grunt.registerTask('build', [
		'compileAssets',
		'linkAssetsBuild',
		'clean:dev',
		'copy:dev'
	]);
};
