/** ./api/index.js  vegas.codes **/
var express = require('express');
var router = express.Router();
var vegasCodes = require('./vegascodesdev.js');
var Users = require('./users/users.controller.js')
var authUser = require('./auth/authUser.js');

router.get('/', function(req, res) {
    res.status(200).send('vegas.codes API');
});


router.post('/register', Users.signup);
router.post('/login', Users.login);
router.get('/me', authUser, Users.me);

router.get('/vp/deal/guest', function (req, res) {
  var dealHand = vegasCodes.deal5();
  var dealHandValue = vegasCodes.handChecker(dealHand);
  var resJSON = {dealHand: dealHand, dealHandValue: dealHandValue};
  return res.status(200).json(resJSON);
});

router.get('/vp/deal/user', authUser, function (req, res) {
  var dealHand = vegasCodes.deal5();
  var dealHandValue = vegasCodes.handChecker(dealHand);
  var resJSON = {dealHand: dealHand, dealHandValue: dealHandValue};
  return res.status(200).json(resJSON);
});

module.exports = router;
