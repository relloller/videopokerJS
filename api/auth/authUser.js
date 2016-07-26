var jwt = require('jsonwebtoken');
module.exports = function(req, res, next) {
  var token = {};
  var token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send('Access Denied');
  } else {
    //NOTICE!! Please change secret for JWT below.
    jwt.verify(token, 'upupdowndownleftrightleftrightbaselectstart', function(err, decoded) {
      if (err) return res.status(500).send(err);
      req.body.decoded = decoded;
      next();
    });
  }
};