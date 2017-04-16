/** ./api/videopoker/videopoker.controller.js **/
var VideoPoker = require('./videopoker.model.js');
var User = require('../users/users.model.js');
var vp = require('../videopokerJS.js');

module.exports = {
  deal: dealF,
  draw: drawF
};

//deal initial 5 cards
function dealF(req, res) {
  var credits1 = 0;
  User.findOne({
    'username': req.body.decoded.username
  }, function(err, data) {
    if (err) return handleError(res, err);
    if (data.credits >= req.body.wager) data.credits -= req.body.wager;
    else return res.status(400).send('Wager exceeds credits balance');
    credits1 = data.credits;
    data.save(function(err) {
      if (err) return handleError(res, err);
      var dealHand = vp.deal5();
      var dealHandData = vp.handChecker(dealHand);
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

//draw new cards after initial cards have been dealt
function drawF(req, res) {
  if (Array.isArray(req.body.holdCards) === false) return res.status(405).send('Invalid input.');
  if (req.body.holdCards.length !== 5) return res.status(405).send('Invalid input.');
  var holdCardsClone = vp.deepCloneInt(req.body.holdCards);

  VideoPoker.findById(req.body.tID, function(err, data) {
    if (err)  {
      if(err.path === '_id' && err.reason === undefined) return res.status(404).send('Game not found');
      return handleError(res, err);
    }
    if(data.drawCards.length === 5 || data.holdCards.length === 5) return res.status(404).send('Game with submitted tID closed');
    //checks if submitted HOLD cards are contained in original deal cards
    for (var i = 0; i < 5; i++) {
      if (holdCardsClone[i] !== 0 && holdCardsClone[i] !== data.dealCards[i]) {
          return res.status(405).send('Invalid input');
        }
    }
    var drawCards = vp.drawN(data.dealCards, holdCardsClone);
    var currentHand = vp.handChecker(drawCards);
    data.holdCards = holdCardsClone;
    data.drawCards = drawCards;
    data.handValue = currentHand.Value;
    data.drawTime = Date.now();
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
  return res.status(500).send('500 error');
}