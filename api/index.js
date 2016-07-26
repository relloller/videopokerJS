/** ./api/index.js  vegas.codes **/
var express = require('express');
var router = express.Router();
var vegasCodes = require('./vegascodesdev.js');

router.get('/', function(req, res) {
    res.status(200).send('vegas.codes API');
});

router.get('/vp/deal', function dealF(req, res) {
  var dealHand = vegasCodes.deal5();
  var dealHandValue = vegasCodes.handChecker(dealHand);
  console.log('dealHand, dealHandValue', dealHand, dealHandValue);
  var resJSON = {dealHand: dealHand, dealHandValue: dealHandValue};
  return res.status(200).json(resJSON);
});


module.exports = router;
