var barf = require('../services/alphanumeric.js');

/**
* ServerKey.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    key: {
     type: 'string',
     index: true
    },
    name: 'string',
    active: {
      type: 'boolean',
      defaultsTo: true
    },
    user: {
      model: 'User'
    }
  },
  beforeCreate: function (values, cb) {
    generateUniqueKey();

    function generateUniqueKey () {
      var key = [barf(), barf(), barf(), barf()].join('-'); //=> PZbpI-37tA6-Tswaj-gJCoi
      ServerKey.find({key: key}).exec(function (e, existingKey) {
        if (existingKey.length > 0) return generateUniqueKey();
        values.key = key;
        cb();
      });
    }
  }
};

