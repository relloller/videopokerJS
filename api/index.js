/** ./api/index.js  **/
var express = require('express');
var router = express.Router();
var Users = require('./users/users.controller.js')
var authUser = require('./auth/authUser.js');
var VP = require('./videopoker/videopoker.controller.js');

router.get('/', function(req, res) {
    return res.status(200).send('videopokerJS API');
});


router.post('/register', Users.signup);
router.post('/login', Users.login);

router.get('/me', authUser, Users.me);

router.post('/vp/deal/user', authUser, VP.deal);
router.post('/vp/draw/user', authUser, VP.draw);


module.exports = router;
