//STATE VARIABLE
var vptID = {
  tID: '',
  dealHand: [],
  RSide: false,
  handValue: '--',
  wager: 5,
  gameStatus: 'bet',
  holdCards: [0, 0, 0, 0, 0],
  drawHand: [],
  win: '',
  username: '',
  credits: 0,
  acronym: {
    'JB': 'Jacks or Better',
    'TP': 'Two Pair',
    'THK': 'Three of a kind',
    'ST': 'Straight',
    'FL': 'Flush',
    'FH': 'Full House',
    'FK': 'Four of a kind',
    'SF': 'Straight Flush',
    'RF': 'Royal Flush',
    '--': '--'
  }
};
var c1D = document.getElementById('c1');
var c2D = document.getElementById('c2');
var c3D = document.getElementById('c3');
var c4D = document.getElementById('c4');
var c5D = document.getElementById('c5');
var cDArr = [c1D, c2D, c3D, c4D, c5D];
var c1I = document.getElementById('c1img');
var c2I = document.getElementById('c2img');
var c3I = document.getElementById('c3img');
var c4I = document.getElementById('c4img');
var c5I = document.getElementById('c5img');
var creditsDiv = document.getElementById('credits');
var drawBtn = document.getElementById('drawbutton');
var drawBtnJQ = $("#drawbutton")
var dealBtn = document.getElementById('dealbutton');
var dealBtnJQ = $("#dealbutton");
var showLoginBtnJQ = $("#showLogin");
var showRegBtnJQ = $("#showRegister");
var loginBtn = document.getElementById('loginButton');
var regBtn = document.getElementById('loginButton');
//update STATE variable
//and call DOM updater
function updObjProps(newObj, oldObj) {
  var newKV = {};
  for (var prop in newObj) {
    oldObj[prop] = newObj[prop];
    newKV[prop] = prop;
  };
  // console.log('vptID-updObjprop', vptID, 'newKV', newKV);
  updDom();
}
//Updates DOM to show vptID variable STATE 
function updDom() {
  if (vptID.gameStatus === "login") {
    updateUsername();
    updateLoggedInDom();
    updateCredits();
  } else if (vptID.gameStatus === "newvptID") {
    updateTable('reset');
    updatePayout();
    updateBestHand();
  } else if (vptID.gameStatus === "deal") {
    updateCards(vptID.dealHand);
    updateTable();
    updateBestHand();
    updateCredits();
  } else if (vptID.gameStatus === "draw") {
    updateCards(vptID.drawHand);
    updateTable();
    updateBestHand();
    updateCredits();
    updatePayout();
  };
};

function updateLoggedInDom() {
  $("#logoutButton").toggle();
  $("#loginButton").toggle();
  $("#registerButton").toggle();
  $("#usernameInput").hide();
  $("#passwordInput").text('');
  $("#passwordInput").hide();
}

function updateUsername() {
  $("#loginSpan").text(vptID.username);
  $("#usernameRDiv").text("Player:" + vptID.username);
}

function updateTable(res) {
  if (res === 'reset' && vptID.handValue !== "--") document.getElementById(vptID['handValue']).classList.remove("payouthighlight");
  else if (vptID.handValue !== "--") document.getElementById(vptID['handValue']).classList.add("payouthighlight");
}

function updateCredits() {
  // console.log(vptID.credits);
  $("#credits").text(vptID.credits);
}

function updatePayout() {
  $("#payout").text(vptID.win);
}

function updateBestHand() {
  var longStr = vptID.acronym[vptID['handValue']];
  // console.log('bh', longStr);
  $('#besthand').text(longStr);
}

function updateCards(cards) {
  c1I.src = "img/" + cards[0] + "min.png";
  c2I.src = "img/" + cards[1] + "min.png";
  c3I.src = "img/" + cards[2] + "min.png";
  c4I.src = "img/" + cards[3] + "min.png";
  c5I.src = "img/" + cards[4] + "min.png";
}

function loginF(loginData) {
  var request = new XMLHttpRequest();
  request.open("POST", "/api/login");
  var vptIDJSON = {};
  request.setRequestHeader("Content-type", "application/json");
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status == 200) {
      vptID.gameStatus = 'login';
      $("#panel-02").toggleClass('ui-panel-open ui-panel-closed');
      vptID.RSide = false;
      // console.log('request', request.response);
      vptIDJSON = JSON.parse(request.response);
      window.localStorage.setItem('jwtvp', vptIDJSON.token);
      // console.log('vptIDJSON', vptIDJSON);
      delete vptIDJSON.token;
      updObjProps(vptIDJSON, vptID);
      $("#logoutButton").on('touchend', function(e) {
        propStop(e);
        delete window.localStorage.jwtvp;
        $("#logoutButton").toggle();
        $("#showLogin").toggle();
        $("#loginSpan").text('Login');
      });
      $("#logoutButton").on('mousepress', function(e) {
        propStop(e);
        delete window.localStorage.jwtvp;
        $("#logoutButton").toggle();
        $("#showLogin").toggle();
        $("#loginSpan").text('Login');
      });
    }
  };
  request.send(JSON.stringify(loginData));
}
//resets state variable for new game
function newvptIDF() {
  updateTable("reset");
  vptID.tID = '';
  vptID.dealCards = [];
  for (var i = 0; i < 5; i++) {
    if (vptID.holdCards[i] !== 0) {
      cDArr[i].classList.toggle("discards")
      cDArr[i].classList.toggle("holding");
    }
  }
  vptID.holdCards = [0, 0, 0, 0, 0];
  vptID.drawCards = [];
  vptID.win = '--';
  vptID.handValue = '--';
  vptID.gameStatus = 'newvptID';
  updDom();
  dealHandF();
}

function dealHandF() {
  var request = new XMLHttpRequest();
  var params = "wager=" + vptID.wager;
  var vptIDJSON2 = {};
  request.open("POST", "/api/vp/deal/user", async = true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.setRequestHeader("x-access-token", window.localStorage.jwtvp);
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status == 200) {
      dealBtnJQ.hide();
      drawBtnJQ.show();
      vptID.gameStatus = 'deal';
      vptIDJSON2 = JSON.parse(request.response);
      updObjProps(vptIDJSON2, vptID);
    }
  }
  request.send(params);
}

function drawHandF() {
  updateTable('reset');
  //example to show videopokerjs API call with XMLHttpRequest
  var request = new XMLHttpRequest();
  var params = {
    holdCards: vptID.holdCards,
    tID: vptID.tID
  };
  var vptIDJSON3 = {};
  request.open("POST", "/api/vp/draw/user");
  request.setRequestHeader("Content-type", "application/json");
  request.setRequestHeader("x-access-token", window.localStorage.jwtvp);
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status == 200) {
      vptID.gameStatus = 'draw';
      drawBtnJQ.hide();
      dealBtnJQ.show()
      vptIDJSON3 = JSON.parse(request.response);
      // console.log('vptIDJSON3', vptIDJSON3);
      updObjProps(vptIDJSON3, vptID);
      $("#dealbutton").on('touchend', function(e) {
        propStop(e);
        vptID.gameStatus = 'newvptID';
        if (vptID.gameStatus === 'newvptID') {
          newvptIDF();
          $("#dealbutton").off('touchend');
        }
      });
      $("#drawbutton").on('mousedown', function(e) {
        propStop(e);
        vptID.gameStatus = 'newvptID';
        if (vptID.gameStatus === 'newvptID') {
          newvptIDF();
          $("#dealdrawbutton").off('mousedown');
        }
      });
    }
  }
  request.send(JSON.stringify(params));
}
evtDeets('touchend');

function evtDeets(typeevt) {
  document.addEventListener(typeevt, function(e) {
    propStop(e);
    if (vptID.RSide = 'true') {
      if(e.target.id === 'RSX') {
         $("#panel-02").toggleClass('ui-panel-open ui-panel-closed');
      vptID.RSide = false;
      }
      if (e.target.id === 'usernameInput') {
        $("#usernameInput").trigger("focus");
      } else if (e.target.id === 'passwordInput') {
        $("#passwordInput").trigger("focus");
      } else if (e.target.id === 'usernameInputR') {
        $("#usernameInputR").trigger("focus");
      } else if (e.target.id === 'passwordInputR') {
        $("#passwordInputR").trigger("focus");
      } else if (e.target.id === 'emailInputR') {
        $("#emailInputR").trigger("focus");
      } else if (e.target.id === 'loginButton') {
        var loginD = {
          username: document.getElementById("usernameInput").value,
          password: document.getElementById("passwordInput").value
        };
        loginF(loginD);
        document.getElementById("passwordInput").value = '';
      } else if (e.target.id === 'registerButton') {
        var regInfo = {
          'username': document.getElementById("usernameInputR").value,
          'email': document.getElementById("emailInputR").value,
          'password': document.getElementById("passwordInputR").value
        };
        registerF(regInfo);
      }
      if (e.target.id === 'showLogin') {
        $("#loginFormDiv").toggle();
      } else if (e.target.id != 'panel-02' && e.target.offsetParent.id !== 'panel-02' && e.target.parentElement.offsetParent.id !== 'panel-02') {
        $("#panel-02").toggleClass('ui-panel-open ui-panel-closed');
      } else if (e.target.id === 'showRegister') {
        $("#registerFormDiv").toggle();
      }
    }
    if (e.target.id !== 'panel-02' && e.target.offsetParent.id !== 'panel-02' && e.target.parentElement.offsetParent.id !== 'panel-02') {
      $("#panel-02").toggleClass('ui-panel-open ui-panel-closed');
      vptID.RSide = false;
    }
    holdCardFF(e, ['c1img', 'c2img', 'c3img', 'c4img', 'c5img'], [c1D, c2D, c3D, c4D, c5D]);
    buttonFn(e, ['dealbutton', 'drawbutton', 'p2']);

    function buttonFn(e, tarID, fna) {
      if (e.target.id === 'p2') {
        $("#panel-02").toggleClass('ui-panel-open ui-panel-closed');
        vptID.RSide = 'true';
      }
      if (e.target.id === 'dealbutton') {
        dealHandF();
      } else if (e.target.id === 'drawbutton') drawHandF();
      else if (vptID.gameStatus === 'draw' || vptID.gameStatus === 'bet') {
        if (e.target.id === 'wagerup') {
          if (vptID.wager < vptID.credits) vptID.wager += 1;
          $("#wager").text(vptID.wager);
        }
        if (e.target.id === 'wagerdown') {
          if (vptID.wager < vptID.credits) vptID.wager -= 1;
          $("#wager").text(vptID.wager);
        }
      }
    }

    function holdCardFF(e, tarID, el) {
      for (var i = 0; tarID.length > i; i++) {
        if (e.target.id === tarID[i]) {
          el[i].classList.toggle('discards');
          el[i].classList.toggle('holding');
          if (vptID.holdCards[i] === 0) vptID.holdCards[i] = vptID.dealHand[i];
          else vptID.holdCards[i] = 0;
          break;
        }
      }
      return;
    }
  });
}

function propStop(evt) {
  evt.preventDefault();
  evt.stopImmediatePropagation();
  evt.stopPropagation();
}

function dealButtonF() {
  $("#logoutButton").toggle();
  $(document).on('keydown', function(evk) {
    if (vptID.gameStatus === 'deal' && vptID.RSide === false) {
      if (evk.keyCode === 65) {
        propStop(evk);
        $("#c1").toggleClass('holding');
        vptID.holdCards[0] = vptID.holdCards[0] === 0 ? vptID.dealHand[0] : 0;
      } else if (evk.keyCode === 83) {
        propStop(evk);
        $("#c2").toggleClass('holding');
        vptID.holdCards[1] = vptID.holdCards[1] === 0 ? vptID.dealHand[1] : 0;
      } else if (evk.keyCode === 68) {
        propStop(evk);
        $("#c3").toggleClass('holding');
        vptID.holdCards[2] = vptID.holdCards[2] === 0 ? vptID.dealHand[2] : 0;
      } else if (evk.keyCode === 70) {
        propStop(evk);
        $("#c4").toggleClass('holding');
        vptID.holdCards[2] = vptID.holdCards[3] === 0 ? vptID.dealHand[3] : 0;
      } else if (evk.keyCode === 71) {
        propStop(evk);
        $("#c5").toggleClass('holding');
        vptID.holdCards[4] = vptID.holdCards[4] === 0 ? vptID.dealHand[4] : 0;
      }
    }
  });
}


function registerF(regInfo) {
  var vptIDJSONR = {};
  $.ajax({
    type: "POST",
    url: "/api/register",
    data: JSON.stringify(regInfo),
    dataType: 'json',
    contentType: 'application/json',
    success: function(data) {
      vptIDJSONR = data;
      vptID.gameStatus = 'login';
      $("#panel-02").toggleClass('ui-panel-open ui-panel-closed');
      vptID.RSide = false;
      window.localStorage.setItem('jwtvp', vptIDJSONR.token);
      delete vptIDJSONR.token;
      updObjProps(vptIDJSONR, vptID);
    },
    fail: function(err) {
      // console.log('errreg', err);
    }
  });
};

$(document).ready(dealButtonF);