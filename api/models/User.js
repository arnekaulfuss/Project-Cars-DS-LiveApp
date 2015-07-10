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
    steamPrimaryClanID: {
      type: 'string'
    },
    steamUserName: {
      type: 'string',
      index: true
    },
    steamRealName: {
      type: 'string'
    },
    steamLocCountryCode: {
      type: 'string'
    },
    steamLocStateCode: {
      type: 'string'
    },
    steamLocCityID: {
      type: 'integer'
    },
    steamAvatar: {
      type: 'string'
    },
    steamAvatarMedium: {
      type: 'string'
    },
    steamAvatarFull: {
      type: 'string'
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

