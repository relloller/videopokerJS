/** ./api/config/passport.js **/

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../users/users.model.js');

passport.use(new LocalStrategy({}, function(username, password, done) {
    User.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                message: 'User not found.'
            });
        }
        // if (!user.validatePassword(password)) {
        //     return done(null, false, {
        //         message: 'Incorrect password.'
        //     });
        // }
        user.validatePassword(password, function(err,result){
            if(err) return err;
            if(result===true){
                return done(null, user);
            } else {
                return done(null, false, {
                message: 'User not found.'
            });
            }
        })
    });
}
));
