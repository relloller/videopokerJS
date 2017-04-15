/* /api/videopokerJS.js */
'use strict';
const deck52 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52];

module.exports = {
    deal5: deal5,
    handChecker: handChecker,
    deepCloneInt: deepCloneInt,
    drawN: drawN
};

//clone one dimensional arr by value
function deepClone(arr) {
    var arrCopy = [];
    for (var i = 0; i < arr.length; i++) arrCopy.push(arr[i]);
    return arrCopy;
}

//clone arr by value. each element is converted to an integer
function deepCloneInt(arr) {
    var arrCopy = [];
    for (var i = 0; i < arr.length; i++) arrCopy.push(parseInt(arr[i]));
    return arrCopy;
}

//generates pseudo-random index from given array
function rndIndx(arr) {
    return Math.floor(Math.random() * arr.length);
}

//deals n card(s) from deck. returns array(int) of N cards.
function dealNCards(deck, n) {
    var cardsTemp = [];
    for (var i = 0; n > i; i++) cardsTemp.push(deck.splice(rndIndx(deck), 1)[0]);
    return cardsTemp;
}

//deals 5 cards from deck. returns array(int) of 5 cards.
function deal5() { return dealNCards(deepClone(deck52), 5)}


//restores deck from previous deal given array of dealt cards
function restoreDeck(dealt) {
    var deckClone = deepClone(deck52);
    var dealtDescending = deepClone(dealt).sort(function(a, b) {return b - a;});
    for (var i = 0; i < 5; i++) deckClone.splice(dealtDescending[i] - 1, 1);
    return deckClone;
}


/*   @function drawN restores the deck from first deal, then draws from restored deck
 *   @param {Number[]} dealt - 5 unique integers from 1-52 to playing cards in a deck. ex. [ 19, 23, 50, 13, 4 ]
 *   @param {Number[]} held - same as above, but cards to be replaced have value 0. ex. [ 19, 23, 0, 0, 0 ]
 */
function drawN(dealt, held) {
    var deckRestore = restoreDeck(deepClone(dealt));
    var heldTemp = deepClone(held);
    for (var i = 0; i < 5; i++){
        if (heldTemp[i] === 0) heldTemp[i] = deckRestore.splice(rndIndx(deckRestore), 1)[0];
    }
    return heldTemp;
};


/*   @function handConvert13Base converts card values in hand array to base 13 
 *   @param {Number[]} hand - 5 unique integers from 1-52 to playing cards in a deck. ex. [ 19, 23, 50, 13, 4 ]
 *   @returns {Number[]} hand13base - 5 integers from 1-13 representing A,2,3,4,5,6,7,8,9,10,J,Q,K
 */
function handConvert13Base(hand) {
    var hand13base = [];
    var handT = deepClone(hand);
    for (var i = 0; i < 5; i++) {
        if (handT[i] <= 13) hand13base.push(handT[i]);
        else if (handT[i] % 13 === 0) hand13base.push(13);
        else hand13base.push(handT[i] % 13);
    }
    return hand13base;
}


/*    @function handData provides hand data such as card frequency, unique cards
      @param {Number[]} hand - 5 unique integers from 1-52 to playing cards in a deck. ex. [ 19, 23, 50, 13, 4 ]
*/
function handData(hand) {
    var h13Clone = handConvert13Base(hand);
    var matchedCards = {};
    var countMax = {
        len: 0,
        card: 0
    };

    for (var i = 0; i < 5; i++) {
        if (matchedCards[h13Clone[i]]===undefined) matchedCards[h13Clone[i]] = 1;
        else if(++matchedCards[h13Clone[i]] > countMax.len) countMax = {'len':matchedCards[h13Clone[i]], 'card':h13Clone[i]};
        else if(matchedCards[h13Clone[i]] === countMax.len) {
          if(h13Clone[i] === 1) countMax.card = 1;
          else if (h13Clone[i]>countMax.card) countMax.card=h13Clone[i];
        }
    }
    return {
        origCards: hand,
        base13Cards: h13Clone,
        cardFreq: matchedCards,
        uniqCards: Object.keys(matchedCards).map(e=> {
            return parseInt(e);
        }),
        uniqLen: Object.keys(matchedCards).length,
        maxMatches: countMax.len,
        maxCard: countMax.card
    }
}


/*    @function handValueF returns value and payout of cards in h. 
  *   @param {Number[]} h - 5 unique integers from 1-52 to playing cards in a deck. ex. [ 19, 23, 50, 13, 4 ]
  *   @returns {Object} Object.Value {String} - Value of hand. ex. 'JB'(jacks or better), 'SF'(straight flush),--(nothing)
                        Object.payX {Integer} - Payout mulitplier
*/
function handValueF(h) {
    var payout = {
      JB: {Value: 'JB', payX:1},
      TP:{Value: 'TP', payX:2},
      THK:{Value: 'THK', payX:3},
      FH:{Value: 'FH', payX:8},
      FK:{Value: 'FK', payX:35},
      ST:{Value: 'ST', payX:4},
      FL:{Value: 'FL', payX:5},
      SF:{Value: 'SF', payX:50},
      RF:{Value: 'RF', payX:800}
    };
    function job() {return (h.uniqLen === 4 && h.maxMatches === 2 && (h.maxCard > 10 || h.maxCard === 1))}
    function twopair() {return (h.uniqLen === 3 && h.maxMatches === 2)}
    function threeofakind() {return (h.uniqLen === 3 && h.maxMatches === 3)}
    function fullhouse() {return (h.uniqLen === 2 && h.maxMatches === 3)}
    function fourofakind() {return h.maxMatches === 4}
    function straight1() {return (h.uniqLen === 5 && h.uniqCards[4] - h.uniqCards[0] === 4)}
    //high straight AKQJ10
    function straight2() {
        return (h.uniqLen === 5 && h.uniqCards[0] === 1 && h.uniqCards.reduce((t, n)=> {return t + n}, 0) == 47)
    }
    function straight() { return (straight1() || straight2())}
    function flush() {
      var origClone = deepClone(h.origCards).sort(function(a,b){return a-b});
      if(origClone[4]<=13) return true;
      if(origClone[0]>13 && origClone[4]<=26) return true;
      if(origClone[0]>26 && origClone[4]<=39) return true;
      if(origClone[0]>39 && origClone[4]<=52) return true;
      return false;
    }
    function straightflush() { return straight1() && flush()}
    function royalflush() {return flush() && straight2()}

    if (job()) return payout.JB;
    else if (twopair()) return payout.TP;
    else if (threeofakind()) return payout.THK;
    else if (fullhouse()) return payout.FH;
    else if (fourofakind()) return payout.FK;
    else if (royalflush()) return payout.RF;
    else if (straightflush()) return payout.SF;
    else if (straight()) return payout.ST;
    else if (flush()) return payout.FL;
    return {Value:'--', payX:0};
};


function handChecker(hand) { return handValueF(handData(deepClone(hand)))}
