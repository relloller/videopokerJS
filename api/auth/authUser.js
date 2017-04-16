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
                if (err.message === 'invalid token') return res.status(401).send('Unauthorized: Invalid authentication token.');
                return res.status(500).send('500 error');
            }
            req.body.decoded = decoded;
            next();
        });
    }
};