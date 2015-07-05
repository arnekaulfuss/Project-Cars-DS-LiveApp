var spawn = require('child_process').spawn;
var promise = require('bluebird');

module.exports = function (script, args) {
  return new promise(function(resolve, reject) {
    var subProcess = spawn(script, args);
    console.log('RUNNING SCRIPT %s', script);
    console.log('WITH ARGS', args);
    var response = '';

    subProcess.stdout.on('data', updateResponse);
    subProcess.stderr.on('data', updateResponse);

    subProcess.on('close', function (code, signal) {
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

    function updateResponse (data) {
      if (data && data.length) response += data.toString('utf8');
    }

    function convertResponse () {
      try {
        return JSON.parse(response);
      } catch (e) {
        console.log("RESPONSE IS NOT JSON");
        return response;
      }
    }
  });
};