module.exports = function(req, res, next) {

  if ( (req.session.user && req.session.user.admin) || sails.config.environment === "development") return next();

  if (req.wantsJSON) return res.send(401);

  res.redirect('/auth/steam');
};
