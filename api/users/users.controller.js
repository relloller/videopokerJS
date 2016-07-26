//controller.js users

'use strict';
var passport = require('passport');
var mongoose = require('mongoose');
var User = require('./mongo.model.js');

// function isAdmin(arguments) {

// };

module.exports.signup = createUser;
module.exports.login = loginUser;
module.exports.checkRole = checkRole;
module.exports.me = whoAmI;


function createUser(req, res) {
    if (!req.body.email || !req.body.username || !req.body.password) {
        return res.status(400).send('All fields required');
    }

    var user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.role = req.body.role || 'player';
    if (user.role === 'admin') {
        return res.status(400).send('Admin account creation not authorized');
    }
    user.hashPassword(req.body.password);
    user.save(function(err) {
        var token;
        if (err) {
            if(err.code === 11000) {
                return res.status(409).send('username exists');
            }
            return handleError(res, 'Error');
        }
        token = user.signJWT();
        console.log('user', user);
        return res.status(201).json({
            'token': token,
            'username': user.username,
            'credits': user.credits
        });
    // return res.status(201).send('Successful');
    });
}
;

function loginUser(req, res) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send('All fields required');
    }
    passport.authenticate('local', function(err, user, info) {
        var token;
        if (err) {
            return res.status(404).send(err);
        }
        console.log('loginUser user', user);
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

function whoAmI (req,res) {
    console.log('reqdecoxed', req.body.decoded);
    User.findOne({username: req.body.decoded.username}, function(err,data) {
        if(err) return handleError(res,err);

        return res.status(200).json({
            username: data.username,
            email: data.email,
            role: data.role,
            credits: data.credits
        });
    })
};

function checkRole(req, res) {
    console.log('checkRole');

    console.log('req.staffUser', req.staffUser);
    return res.status(200).json(req.staffUser);

}
;

function handleError(res, err) {
    return res.status(500).send(err);
}
