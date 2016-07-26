/** ./api/index.js  **/
var express = require('express');
var router = express.Router();
var vegasCodes = require('./vegascodesdev.js');
var Users = require('./users/users.controller.js')
var authUser = require('./auth/authUser.js');
var VP = require('./videopoker/videopoker.controller.js');
router.get('/', function(req, res) {
    res.status(200).send('vegas.codes API');
});


router.post('/register', Users.signup);
router.post('/login', Users.login);
router.get('/me', authUser, Users.me);

router.post('/vp/deal/guest', function (req, res) {
  var dealHand = vegasCodes.deal5();
  var dealHandValue = vegasCodes.handChecker(dealHand);
  var resJSON = {dealHand: dealHand, dealHandValue: dealHandValue};
  return res.status(200).json(resJSON);
});

router.post('/vp/deal/user', authUser, VP.deal);
router.post('/vp/draw/user', authUser, VP.draw);


module.exports = router;
