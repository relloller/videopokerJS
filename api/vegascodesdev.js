
/** /api/vegascodesdev.js **/

var deck52 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52];

module.exports = {
  deal5: deal5,
  deck52: deck52,
  handChecker: handChecker,
  deepClone: deepClone,
  deepCloneInt: deepCloneInt,
  restoreDeck: restoreDeck,
  drawN: drawN
};

//clone arr by value
function deepClone(arr) {
  var arrCopy = [];
  for (var i = 0; i < arr.length; i++) arrCopy.push(arr[i]);
  return arrCopy;
}

//callback cb for each element in array
function each(arr, cb) {
  for (var i = 0, len = arr.length; i < len; i++) cb(arr[i]);
}

//clone arr by value. each element is transferred to an integer
function deepCloneInt(arr) {
  var arrCopy = [];
  for (var i = 0; i < arr.length; i++) arrCopy.push(parseInt(arr[i]));
  return arrCopy;
}

//generates pseudo-random index from given array
function rndNum(arr) {
  console.log('deckrestorerndDum', arr.length);
  return Math.floor(Math.random() * (arr.length));
}

// deals 1 card from deck. returns single card from deck
function deal1Card(deck) {
  return deck.splice(rndNum(deck), 1)[0];
}


//deals 5 cards from deck. returns array(int) of 5 cards.
function deal5() {
  return dealNCards(deepClone(deck52), 5);
}

//deals N card(s) from deck. returns array(int) of N cards.
function dealNCards(deck, N) {
  var cards = [];
  for (var i = 0; N > i; i++) cards.push(deck.splice(rndNum(deck), 1)[0]);
  return cards;
}

//similar to dealNCards function
function drawN(deckRestore, holdCardsArr) {
  // var deckRestoreClone = deepClone(deckRestore);
  for (var i = 0; i < 5; i++) {
    if (holdCardsArr[i] === 0) holdCardsArr[i] = deckRestore.splice(rndNum(deckRestore), 1)[0];
  }
  return holdCardsArr;
};

//restores deck from previous deal given array of dealt cards
function restoreDeck(dealtCards, deck) {
  var deckClone = deepClone(deck);
  var dealtCardsDesc = dealtCards.sort(function(a, b) {
    return b - a;
  });
  for (var i = 0, len = dealtCardsDesc.length; i < len; i++) deckClone.splice(dealtCardsDesc[i] - 1, 1);
  return deckClone;
}


//logic for checking value of hand
function handMatch(arr1, arr2) {
  for (var i = 0; i < 5; i++) {
    var match = false;
    for (var j = 0; j < 5; j++) {
      if (arr1[i] === arr2[j]) match = true;
    }
    if (match) return true;
  }
  return false;
}

// returns value of array hand. each element of hand is an integer. hand is 5 elements in length
function handChecker(hand) {
  if (Array.isArray(hand) === false) {
    return 'error'
  }
  var handClone = deepClone(hand);
  var hand13 = handConvert13Base(hand);
  // var hand13Clone = deepClone(hand13);
  return handValueF(containsArrClosure(deepClone(hand13), handClone));
}

//logic for checking value of hand. closure solution.
function containsArrClosure(hand1, handC) {
  var handClone = deepClone(hand1);
  var hand13 = handConvert13Base(handClone);
  var uniqCards = {};
  var countMax = {
    len: 0,
    card: ''
  };
  var hand13Clone = deepClone(hand13);
  for (var i = 0; i < hand13Clone.length; i++) {
    var countThis = 0;
    if (uniqCards[hand13Clone[i]] === undefined) {
      uniqCards[parseInt(hand13Clone[i])] = 0;
      for (var j = i + 1; j < hand13Clone.length; j++) {
        if (hand13Clone[i] === hand13Clone[j]) {
          countThis++;
          uniqCards[hand13Clone[i]]++;
        }
      }
    }
    if (countThis > countMax.len) {
      countMax.len = countThis;
      countMax.card = hand13Clone[i];
    }
  }
  var resultsClosure = {
    origCards: handC,
    base13Cards: hand13,
    uniqCards: uniqCards,
    uniqArr: Object.keys(uniqCards).map(function(e) {
      return parseInt(e);
    }),
    uniqArrL: Object.keys(uniqCards).length,
    countMaxMatches: countMax.len,
    countMaxCard: countMax.card
  };
  return resultsClosure;
}

//logic for checking value of hand. recursive solution. tested slower than closure solution.
function containsArrRecursive(hand13CloneArg, indx, countMaxPrev, recurseCount) {
  var hand13ToSplice = [];
  var hand13Clone = hand13CloneArg;
  var ind = indx || 0;
  if (ind === hand13Clone.length) {
    return {
      countMax: countMaxPrev,
      uniqArr: hand13CloneArg.sort(function(a, b) {
        return a - b;
      }),
      uniqArrL: hand13CloneArg.length,
      recurseCount: recurseCount
    };
  }
  var countMatches = 0;
  var matched = false;
  var hand13ToSpliceDesc = [];
  for (var i = ind, len = hand13Clone.length; i < len - 1; i++) {
    if (hand13Clone[ind] === hand13Clone[i + 1]) {
      if (!matched) matched = true;
      countMatches++;
      if (countMatches > countMaxPrev) countMax = countMatches;
      else countMax = countMaxPrev;
      hand13ToSplice.push(i + 1);
    }
  }
  if (matched) {
    hand13ToSpliceDesc = hand13ToSplice.sort(function(a, b) {
      return b - a;
    });
    each(hand13ToSpliceDesc, function(e) {
      hand13Clone.splice(e, 1);
    });
  }
  return containsArrRecursive(hand13Clone, ind + 1, countMax, recurseCount + 1);
}

//convert card value in hand array to base 13 
function handConvert13Base(hand) {
  var hand13base = [];
  for (var i = 0, len = hand.length; i < len; i++) {
    if (hand[i] <= 13) hand13base.push(hand[i]);
    else if (hand[i] % 13 === 0) hand13base.push(13);
    else hand13base.push(hand[i] % 13);
  }
  return hand13base;
}

//checks value of hand with hData values
function handValueF(hData) {
  console.log('handValue hData', hData);

  function job() {
    return (hData.uniqArrL === 4 && hData.countMaxMatches === 1 && (hData.countMaxCard > 10 || hData.countMaxCard === 1))
  };

  function twopair() {
    return (hData.uniqArrL === 3 && hData.countMaxMatches === 1)
  };

  function threeofakind() {
    return (hData.uniqArrL === 3 && hData.countMaxMatches === 2)
  };

  function straight() {
    function straight1() {
      return (hData.uniqArrL === 5 && hData.uniqArr[4] - hData.uniqArr[0] === 4)
    };

    function straight2() {
      return (hData.uniqArrL === 5 && hData.uniqArr[0] === 1 && hData.uniqArr.reduce(function(total, num) {
        return total + num;
      }, 0) == 47)
    };
    return (straight1() || straight2());
  }

  function flush() {
    function flush1() {
      if (hData.origCards.every(function(x) {
        return x < 14;
      })) return true;
      return false;
    };

    function flush2() {
      if (hData.origCards.every(function(x) {
        return x > 13 && x < 27;
      })) return true;
      return false;
    };

    function flush3() {
      if (hData.origCards.every(function(x) {
        return x > 26 && x < 40;
      })) return true;
      return false;
    };

    function flush4() {
      if (hData.origCards.every(function(x) {
        return x > 39;
      })) return true;
      return false;
    };
    return (flush1() || flush2() || flush3() || flush4());
  }

  function fullhouse() {
    return (hData.countMaxMatches == 2 && hData.uniqArrL === 2);
  };

  function fourofakind() {
    return hData.countMaxMatches === 3;
  }

  function straightflush() {
    return straight() && flush();
  }

  function royalflush() {
    function highstraight() {
      return (hData.uniqArrL === 5 && hData.uniqArr[0] === 1 && hData.uniqArr.reduce(function(total, num) {
        return total + num
      }, 0) === 47);
    };
    return highstraight() && flush();
  }

  var payout = {
    Value: '--',
    payX: 0
  };

  if (job()) return {Value: 'JB', payX: 1 };
  if (twopair()) return {Value: 'TP', payX: 2 };
  if (threeofakind()) return {Value: 'THK', payX: 3 };
  if (fullhouse()) return {Value: 'FH', payX: 8 };
  if (fourofakind()) return {Value: 'FK', payX: 35 };
  if (straight()) payout = {Value: 'ST', payX: 4 };
  if (flush()) payout = {Value: 'FL', payX: 5 };
  if (straightflush()) payout = {Value: 'SF', payX: 50 };
  if (royalflush()) payout = {Value: 'RF', payX: 800 };
  return payout;
};
