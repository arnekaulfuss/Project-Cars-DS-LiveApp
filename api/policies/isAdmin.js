module.exports = function (req, res, next) {
  if (req.session.me && req.session.me.admin) return next();

  if (req.wantsJSON) return res.send(401);

  res.redirect('/login');
}
