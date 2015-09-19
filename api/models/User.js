var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,
  attributes: {
    username  : {
      type: 'string',
      unique: true,
      index: true,
      size: 50
    },
    email: {
      type: 'email',
      unique: true,
      index: true
    },
    admin: {
      type: 'boolean',
      defaultsTo: false
    },
    steamID: {
      type: 'string',
      index: true
    },
    steamUserName: {
      type: 'string',
      index: true
    },
    steamPrimaryClanID: 'string',
    steamRealName: 'string',
    steamLocCountryCode: 'string',
    steamLocStateCode: 'string',
    steamLocCityID: 'integer',
    steamAvatar: 'string',
    steamAvatarMedium: 'string',
    steamAvatarFull: 'string',
    drivers: {
      collection: 'Driver',
      via: 'user'
    },
    serverKeys: {
      collection: 'ServerKey',
      via: 'user'
    }
  },
  beforeCreate: function (values, cb) {
    //
    values.username            = values.personaname;
    values.steamID             = values.steamid;
    values.steamPrimaryClanID  = values.primaryclanid;
    values.steamUserName       = values.personaname;
    values.steamRealName       = values.realname;
    values.steamLocCountryCode = values.loccountrycode;
    values.steamLocStateCode   = values.locstatecode;
    values.steamLocCityID      = values.loccityid;
    values.steamAvatar         = values.avatar;
    values.steamAvatarMedium   = values.avatarmedium;
    values.steamAvatarFull     = values.avatarfull;
    cb();
  }
};


module.exports = User;

