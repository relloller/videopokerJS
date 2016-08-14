/** ./api/videopoker/videopoker.controller.js **/
var VideoPoker = require('./videopoker.model.js');
var User = require('../users/users.model.js');
var vegasCodes = require('../vegascodesdev.js');
module.exports = {
  deal: dealF,
  draw: drawF
};

function dealF(req, res) {
  var dealHand = vegasCodes.deal5();
  var dealHandData = vegasCodes.handChecker(dealHand);
  var credits1 = 0;
  User.findOne({
    'username': req.body.decoded.username
  }, function(err, data) {
    if (err) return handleError(res, err);
    if (data.credits >= req.body.wager) data.credits -= req.body.wager;
    else return res.status(400).send('Wager exceeds credits balance');
    credits1 = data.credits;
    data.save(function(err) {
      if (err) return handleError(err);
      // var handValue1 = vegasCodes.handChecker(dealHandData);
      VideoPoker.create({
        username: req.body.decoded.username,
        dealCards: dealHand,
        wager: req.body.wager
      }, function(err, data) {
        if (err) return handleError(res, err);
        return res.status(200).json({
          tID: data._id,
          dealHand: dealHand,
          handValue: dealHandData.Value,
          credits: credits1
        });
      });
    })
  });
};

function drawF(req, res) {
  if (Array.isArray(req.body.holdCards) === false) return res.status(405).send('Invalid input');
  if (req.body.holdCards.length !== 5) return res.status(405).send('Invalid input');
  var holdCardsClone = vegasCodes.deepCloneInt(req.body.holdCards);
  VideoPoker.findById(req.body.tID, function(err, data) {
    if (err)  {
    	console.log('err',err);
    	if(err.path === '_id' && err.reason === undefined) return res.status(404).send('Game not found');
    	return handleError(res, err);
    }
    if(data.drawCards.length === 5 || data.holdCards.length === 5) return res.status(404).send('Game with submitted tID not open');
    console.log('drawdata',data);
    //checks if submitted HOLD cards are valid
    for (var i = 0; i < 5; i++) {
      if (holdCardsClone[i] !== 0) {
        if (holdCardsClone[i] !== data.dealCards[i]) {
          return res.status(405).send('Invalid input');
        }
      }
    }
    var drawCards = vegasCodes.drawN(vegasCodes.restoreDeck(data.dealCards, vegasCodes.deck52), holdCardsClone);
    var currentHand = vegasCodes.handChecker(drawCards);
    data.holdCards = holdCardsClone;
    data.drawCards = drawCards;
    data.handValue = currentHand.Value;
    data['wagerResult'] = currentHand.payX * data.wager;
    var wagerResult1 = data['wagerResult'];
    data.save(function(err) {
      if (err) return handleError(res, err);
      User.findOne({
        'username': req.body.decoded.username
      }, function(err, data1) {
        if (err) return handleError(res, err);
        data1.credits += wagerResult1;
        data1.save(function(err) {
          return res.status(200).json({
            drawHand: drawCards,
            handValue: currentHand.Value,
            win: wagerResult1,
            credits: data1.credits
          });
        });
      });
    });
  });
}

function handleError(res, err) {
  console.log('err', err);
  return res.status(500).send('500 error');
};