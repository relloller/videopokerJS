/** ./api/users/users.controller.js **/
'use strict';
var passport = require('passport');
var mongoose = require('mongoose');
var User = require('./users.model.js');

module.exports = {
  signup: createUser,
  login: loginUser,
  checkRole: checkRole,
  me: whoAmI
};

function createUser(req, res) {
  // console.log('req.body', req.body);
  req.body.username = atobAuth(req.headers.authorization.substr(6)).username;
  req.body.password = atobAuth(req.headers.authorization.substr(6)).password;
  if (!req.body.email || !req.body.username || !req.body.password) {
    return res.status(400).send('All fields required');
  }
    // console.log('req.body', req.body);

  var user = new User();
  user.username = req.body.username;
  user.email = req.body.email;
  user.role = req.body.role || 'player';
  if (user.role === 'admin') {
    return res.status(400).send('Admin account creation not authorized');
  }
  user.hashPassword(req.body.password, function (err,hash) {
    if(err) {
      return handleError(res, 'Internal Error');
    }
    user.pwHash = hash;
    user.save(function(err) {
      var token;
      if (err) {
        if (err.code === 11000) {
          console.log('err',err);
          return res.status(409).send('username exists');
        }
        return handleError(res, 'Error');
      }
      token = user.signJWT();
      return res.status(200).json({
        'token': token,
        'username': user.username,
        'credits': user.credits
      });
    });
  });
};

function loginUser(req, res) {
  req.body = atobAuth(req.headers.authorization.substr(6));
  if (!req.body.username || !req.body.password) {
    return res.status(400).send('All fields required');
  }
  passport.authenticate('local', function(err, user, info) {
    var token;
    if (err) {
      return res.status(404).send(err);
    }
    if (user) {
      token = user.signJWT();
      return res.status(200).json({
        'token': token,
        'username': user.username,
        'credits': user.credits
      });
    } else {
      return res.status(401).send(info);
    }
  })(req, res);
};

function whoAmI(req, res) {
  User.findOne({
    username: req.body.decoded.username
  }, function(err, data) {
    if (err) return handleError(res, err);
    return res.status(200).json({
      username: data.username,
      email: data.email,
      role: data.role,
      credits: data.credits
    });
  })
};

function checkRole(req, res) {
  return res.status(200).json(req.staffUser);
};

function atobAuth(str) {
  var userpw =  new Buffer.from(str, 'base64').toString('binary');
  for (var i = 0; i < userpw.length; i++) {
    if(userpw.charAt(i)===":") {
      return {username:userpw.substring(0,i), password:userpw.substring(i+1)};
    }
  }
}

function handleError(res, err) {
  return res.status(500).send(err);
}