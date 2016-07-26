/** ./api/auth/authUser.js **/
var jwt = require('jsonwebtoken');
module.exports = function(req, res, next) {
  var token = {};
  var token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send('Access Denied');
  } else {
    //NOTICE!! Make sure to change JWT secret below. New JWT secret must match JWT secret in ./api/users/users.model.js 
    jwt.verify(token, 'upupdowndownleftrightleftrightbaselectstart', function(err, decoded) {
      if (err) {
        console.log('err.message',err.message);
        if(err.message === 'invalid token') return res.status(401).send('invalid token');
        return res.status(500).send(err);
      }
      req.body.decoded = decoded;
      next();
    });
  }
};