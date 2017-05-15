/** ./api/auth/authUser.js **/
var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send('Unauthorized: Invalid authentication token.');

    //NOTICE!! Make sure to change JWT secret below. New JWT secret must match JWT secret in ./api/users/users.model.js 
    jwt.verify(token, 'upupdowndownleftrightleftrightbaselectstart', function(err, decoded) {
        if (err) {
            if (err.message === 'invalid signature') return res.status(401).send('Unauthorized: Invalid authentication token.');
            return res.status(500).send('System error');
        }
        req.body.username = decoded.username;
        next();
    });
};
