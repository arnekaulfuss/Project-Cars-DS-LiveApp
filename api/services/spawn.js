var spawn = require('child_process').spawn;
var promise = require('bluebird');
var append = require('fs').appendFileSync;
var path = require('path');

module.exports = function(script, args, logFile) {
  return new promise(function(resolve, reject) {
    var subProcess = spawn(script, args);
    var response = '';

    console.log('RUNNING SCRIPT %s', script);
    console.log('WITH ARGS', args);

    subProcess.stdout.on('data', updateResponse);
    subProcess.stderr.on('data', updateResponse);

    subProcess.on('close', function(code, signal) {
      console.log('EXIT CODE: ' + code);

      if (code === 0) {
        console.log("SCRIPT EXITED ON SUCCESS");
        resolve(convertResponse());
      } else {
        console.log("SCRIPT EXITED ON NON SUCCESS");
        reject(convertResponse());
      }
    });


    /*==========  ...  ==========*/

    function updateResponse(data) {
      var hasData = data && data.length;
      if (!hasData) return;

      if (logFile) {
        append(path.resolve(__dirname, '../../log/' + logFile), data);
      } else {
        response += data.toString('utf8');
      }
    }

    function convertResponse() {
      try {
        return JSON.parse(response);
      } catch (e) {
        console.log("RESPONSE IS NOT JSON");
        return response;
      }
    }
  });
};
