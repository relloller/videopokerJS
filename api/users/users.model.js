/** ./api/users/users.model.js **/

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var jsonwebtoken = require('jsonwebtoken');
var userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  credits: {
    type: Number,
    required: true,
    default: 500
  },
  name: String,
  role: {
    type: String,
    required: true,
    default: 'player'
  },
  pwHash: String
});
userSchema.methods.hashPassword = function(password,fnc) {
  bcrypt.hash(password, 11, function(err, hash) {
      if(err) return fnc(err);
      return fnc(false, hash);
  });
};
userSchema.methods.validatePassword = function(password,fnc) {
  bcrypt.compare(password, this.pwHash, function(err, result) {
    if(err) return fnc(err);
    return fnc(false, result);
  });
};
userSchema.methods.signJWT = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 1);
  return jsonwebtoken.sign({
    username: this.username,
    name: this.name,
    role: this.role,
    exp: parseInt(expiry.getTime() / 1000),
    //NOTICE!! Please make sure to change JWT secret below!! Also, new JWT secret must match JWT secret in ./api/auth/authUser.js 
  }, 'upupdowndownleftrightleftrightbaselectstart');
};
module.exports = mongoose.model('Users', userSchema);