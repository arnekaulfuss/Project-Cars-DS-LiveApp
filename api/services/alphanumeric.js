module.exports = function(length) {
  length = length || 5;
  var text = '';
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var match = false;

  while (!match) {
    for (var i = 0; i < length; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // We need an alphanumeric id, check that there are letters in the id
    // !('1234' > 0) /-> false, bad match
    // !('E123' > 0) /-> true, good match
    match = match <= 0;
  }

  return text;
};
