      var vptID = {
        // tID:'',
        // dealHand:[],
        wager: 5,
        gameStatus: 'bet',
        holdCards: [0, 0, 0, 0, 0],
        // drawHand:[],
        // win:[],
        // username: '',
        // credits:0
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
      var c1I = document.getElementById('c1img');
      var c2I = document.getElementById('c2img');
      var c3I = document.getElementById('c3img');
      var c4I = document.getElementById('c4img');
      var c5I = document.getElementById('c5img');
      var creditsDiv = document.getElementById('credits');
      var drawButton = document.getElementById('drawbutton');
      var dealButton = document.getElementById('dealbutton');
      var loginButton = document.getElementById('loginButton');

      function updateTable(hvalueT, res) {
        if (res === 'reset') $('#' + hvalueT).removeClass('payouthighlight');
        else $('#' + hvalueT).addClass('payouthighlight');
      }

      function updatePayout(payout) {
        $('#payout').text(payout);
      }

      function updateBestHand(hvalue) {
        var longStr = vptID['acronym'][hvalue];
        // console.log('bh', hvalue, longStr);
        $('#besthand').text(longStr);
      }

      function updateCredits(creditsD) {
        // console.log(creditsD);
        $("#credits").text(creditsD);
      }

      function updateCards(cards) {
        // console.log('cardsD', cards);
        // console.log('vptID', vptID);
        $("#c1img").attr('src', "img/" + cards[0] + "c.png");
        c2I.src = "img/" + cards[1] + "c.png";
        c3I.src = "img/" + cards[2] + "c.png";
        c4I.src = "img/" + cards[3] + "c.png";
        c5I.src = "img/" + cards[4] + "c.png";
      }

      function loginF(loginData) {
        var request = new XMLHttpRequest();
        // console.log('loginData', loginData);
        request.open("POST", "/api/login");
        var vptIDJSON = {};
        // request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.setRequestHeader("Content-type", "application/json");
        request.onreadystatechange = function() {
          if (request.readyState === 4 && request.status == 200) {
            $("#loginButton").hide();
            $("#usernameInput").hide();
            $("#passwordInput").text('');
            $("#passwordInput").hide();

            // console.log('request', request);
            vptIDJSON = JSON.parse(request.response);
            // console.log('vptIDJSON', vptIDJSON);
            window.localStorage.setItem('jwtvp', vptIDJSON.token);
            vptID.username = vptIDJSON.username;
            vptID.credits = vptIDJSON.credits;
            updateCredits(vptID.credits);
            $("#usernameRDiv").text("Username: " + vptID.username);
            $("#logoutButton").addClass('visib');
              $("#loginSpan").text(vptID.username);
            $("#logoutButton").on('touchend', function(e) {
              e.preventDefault();
              e.stopPropagation();
              delete window.localStorage.jwtvp;
              $("#logoutButton").removeClass('visib');
              $("#loginButton").show();
              $("#usernameInput").show();
              $("#passwordInput").show();
            });
            $("#logoutButton").on('mousepress', function(e) {
              e.preventDefault();
              e.stopPropagation();
              delete window.localStorage.jwtvp;
              $("#logoutButton").removeClass('visib');
              $("#loginButton").show();
              $("#usernameInput").show();
              $("#passwordInput").show();
                            $("#loginSpan").text('Login');

            });
          }
        };
        // console.log('loginData', loginData);
        request.send(JSON.stringify(loginData));
      }

      function dealHandF() {
        for (var i = 0; i < 5; i++) {
          if (vptID.holdCards[i] !== 0) {
            document.getElementById('c' + (i + 1)).classList.remove("holding");
            document.getElementById('c' + (i + 1)).classList.add("discards");
          }
        }
        vptID.win = '-';
        updatePayout(vptID.win);
        updateTable('--', 'reset');
        // console.log('dealHandF');
        vptID.holdCards = [0, 0, 0, 0, 0];
        var request = new XMLHttpRequest();
        var params = "wager=" + vptID.wager;
        var vptIDJSON2 = {};
        request.open("POST", "/api/vp/deal/user");
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.setRequestHeader("x-access-token", window.localStorage.jwtvp);
        request.onreadystatechange = function() {
          if (request.readyState === 4 && request.status == 200) {
            // console.log('request', request);
            vptIDJSON2 = JSON.parse(request.response);
            // console.log('deal', vptIDJSON2);
            vptID.tID = vptIDJSON2.tID;
            vptID.dealHand = vptIDJSON2.dealHand;
            vptID.handValue = vptIDJSON2.handValue;
            vptID.credits = vptIDJSON2.credits;
            updateCredits(vptIDJSON2.credits);
            updateCards(vptIDJSON2.dealHand);
            updateBestHand(vptIDJSON2.handValue);
            updateTable(vptIDJSON2.handValue);
            vptID.gameStatus = 'deal';
            cTouchOnAll();
            cMouseOnAll();
            $('#gamestatus').text(vptID.gameStatus);
            $("#dealdrawbutton").text('DRAW');
            $("#dealdrawbutton").on('touchend', function(e) {
              e.preventDefault();
              e.stopImmediatePropagation();
              e.stopPropagation();
              vptID.gameStatus = 'draw';
              if (vptID.gameStatus === 'draw') {
                drawHandF();
                $("#dealdrawbutton").off('touchend');
              }
            });
            $("#dealdrawbutton").on('mousedown', function(e) {
              e.preventDefault();
              e.stopImmediatePropagation();
              e.stopPropagation();
              vptID.gameStatus = 'draw';
              if (vptID.gameStatus === 'draw') {
                drawHandF();
                $("#dealdrawbutton").off('mousedown');
              }
            });
          }
        }
        request.send(params);
      };

      function drawHandF() {
        updateTable(vptID.handValue, 'reset');
        var request = new XMLHttpRequest();
        var params = {
          holdCards: vptID.holdCards,
          tID: vptID.tID
        };
        var vptIDJSON3 = 0;
        request.open("POST", "/api/vp/draw/user");
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader("x-access-token", window.localStorage.jwtvp);
        request.onreadystatechange = function() {
          if (request.readyState === 4 && request.status == 200) {
            vptIDJSON3 = JSON.parse(request.response);
            // console.log('vptIDJSON3', vptIDJSON3);
            vptID.credits = vptIDJSON3.credits;
            vptID.win = vptIDJSON3.win;
            vptID.drawHand = vptIDJSON3.drawHand;
            vptID.handValue = vptIDJSON3.handValue;
            updateCredits(vptIDJSON3.credits);
            updateCards(vptID.drawHand);
            updatePayout(vptID.win);
            updateBestHand(vptID.handValue);
            updateTable(vptID.handValue);
            $('#gamestatus').text(vptID.gameStatus);
            $("#dealdrawbutton").text('DEAL');
            $("#dealdrawbutton").on('touchend', function(e) {
              e.preventDefault();
              e.stopImmediatePropagation();
              e.stopPropagation();
              updateTable(vptID.handValue, 'reset');
              vptID.gameStatus = 'deal';
              if (vptID.gameStatus === 'deal') {
                dealHandF();
                $("#dealdrawbutton").off('touchend');
              }
            });
            $("#dealdrawbutton").on('mousedown', function(e) {
              e.preventDefault();
              e.stopImmediatePropagation();
              e.stopPropagation();
              updateTable(vptID.handValue, 'reset');
              vptID.gameStatus = 'deal';
              if (vptID.gameStatus === 'deal') {
                dealHandF();
                $("#dealdrawbutton").off('mousedown');
              }
            });
          }
        }
        // var paramsJ = JSON.stringify(params);
        request.send(JSON.stringify(params));
      }

      function cTouchOn(cD) {
        cD.addEventListener('touchend', function(e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();
          if (vptID.gameStatus === 'deal') {
            // console.log('vptID.gameStatus', vptID.gameStatus);
            // console.log('etouch', e);
            // console.log('touchthis', this);
            this.classList.toggle('discards');
            this.classList.toggle('holding');
            var ind = parseInt(this.id.toString().charAt(1)) - 1;
            // console.log('ind', ind);
            if (vptID.holdCards[ind] === 0) vptID.holdCards[ind] = vptID.dealHand[ind];
            else vptID.holdCards[ind] = 0;
            // console.log('vptID.holdCards', vptID.holdCards);
          }
        });
      }

      function cMouseOn(cD) {
        cD.addEventListener('mousedown', function(e) {
          e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();
          if (vptID.gameStatus === 'deal') {
            // console.log('vptID.gameStatus', vptID.gameStatus);
            // console.log('etouch', e);
            // console.log('touchthis', this);
            this.classList.toggle('discards');
            this.classList.toggle('holding');
            var ind = parseInt(this.id.toString().charAt(1)) - 1;
            // console.log('ind', ind);
            if (vptID.holdCards[ind] === 0) vptID.holdCards[ind] = vptID.dealHand[ind];
            else vptID.holdCards[ind] = 0;
            // console.log('vptID.holdCards', vptID.holdCards);
          }
        });
      }

      function cTouchOnAll() {
        cTouchOn(c1D);
        cTouchOn(c2D);
        cTouchOn(c3D);
        cTouchOn(c4D);
        cTouchOn(c5D);
      };

      function cMouseOnAll() {
        cMouseOn(c1D);
        cMouseOn(c2D);
        cMouseOn(c3D);
        cMouseOn(c4D);
        cMouseOn(c5D);
      }
      var sideBarOpen = false;

      function dealButtonF() {
        $("#p2").on('touchend', function(evk2) {
          sideBarOpen = true;
          // console.log('sideBarOpen', sideBarOpen);
          $(document).on('touchstart', function(eek) {
            // console.log('contne1');
            // console.log('eek', eek.target);
            if (eek.target.id != "loginButton" && eek.target.id != "panel-02" && eek.target.id != 'usernameInput' && eek.target.id != 'passwordInput') {
              sideBarOpen = false;
              $(document).off('touchstart');
            }
            // console.log('sideBarOpen2Conten1', sideBarOpen);
          });
        });
        $("#p2").on('mousedown', function(evk2) {
          evk2.preventDefault();
          evk2.stopPropagation();
          sideBarOpen = true;
          // console.log('sideBarOpen', sideBarOpen);
          $("#content1").on('mousedown', function(eek) {
            eek.stopPropagation();
            // console.log('eek', eek.target);
            if (eek.target.id != "loginButton" && eek.target.id != "panel-02" && eek.target.id != 'usernameInput' && eek.target.id != 'passwordInput') {
              sideBarOpen = false;
              $(document).off('mousedown');
            }
            // console.log('sideBarOpen2Conten1', sideBarOpen);
          });
        });
        $(document).on('keydown', function(evk) {
          if (vptID.gameStatus === 'deal' && sideBarOpen === false) {
            if (evk.keyCode === 65) {
              evk.preventDefault();
              evk.stopPropagation();
              $("#c1").toggleClass('holding');
              if (vptID.holdCards[0] === 0) vptID.holdCards[0] = vptID.dealHand[0];
              else vptID.holdCards[0] = 0;
              // console.log('vptID.holdCards', vptID.holdCards);
            } else if (evk.keyCode === 83) {
              evk.preventDefault();
              evk.stopPropagation();
              $("#c2").toggleClass('holding');
              if (vptID.holdCards[1] === 0) vptID.holdCards[1] = vptID.dealHand[1];
              else vptID.holdCards[1] = 0;
              // console.log('vptID.holdCards', vptID.holdCards);
            } else if (evk.keyCode === 68) {
              evk.preventDefault();
              evk.stopPropagation();
              $("#c3").toggleClass('holding');
              if (vptID.holdCards[2] === 0) vptID.holdCards[2] = vptID.dealHand[2];
              else vptID.holdCards[2] = 0;
              // console.log('vptID.holdCards', vptID.holdCards);
            } else if (evk.keyCode === 70) {
              evk.preventDefault();
              evk.stopPropagation();
              $("#c4").toggleClass('holding');
              if (vptID.holdCards[3] === 0) vptID.holdCards[3] = vptID.dealHand[3];
              else vptID.holdCards[3] = 0;
              // console.log('vptID.holdCards', vptID.holdCards);
            } else if (evk.keyCode === 71) {
              evk.preventDefault();
              evk.stopPropagation();
              $("#c5").toggleClass('holding');
              if (vptID.holdCards[4] === 0) vptID.holdCards[4] = vptID.dealHand[4];
              else vptID.holdCards[4] = 0;
              // console.log('vptID.holdCards', vptID.holdCards);
            }
          }
        });
        $("#loginButton").on('touchend', function(e) {
          // console.log('loginBut');
          e.preventDefault();
          e.stopPropagation();
          var loginD = {
            username: document.getElementById("usernameInput").value,
            password: document.getElementById("passwordInput").value
          };
          // console.log('loginD', loginD);
          loginF(loginD);
        });
        $("#loginButton").on('mousedown', function(e) {
          // console.log('mousedownlogbutton');
          e.preventDefault();
          e.stopPropagation();
          var loginD = {
            username: document.getElementById("usernameInput").value,
            password: document.getElementById("passwordInput").value
          };
          // console.log('loginD', loginD);
          loginF(loginD);
        });
        $("#dealdrawbutton").on('touchend', function(ev) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          ev.stopPropagation();
          $(this).off('touchend');
          // console.log('dButtonF');
          dealHandF();
        });
        $("#dealdrawbutton").on('mousedown', function(ev) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          ev.stopPropagation();
          $(this).off('mousedown');
          // console.log('dButtonF');
          dealHandF();
        });
        $("#wagerup").on('touchend', function(ev2) {
          ev2.preventDefault();
          ev2.stopImmediatePropagation();
          ev2.stopPropagation();
          if (vptID.wager < vptID.credits) vptID.wager += 1;
          // $(this).off('touchend');
          // console.log('wagerup');
          if (vptID.gameStatus === 'draw' || vptID.gameStatus === 'bet') $("#wager").text(vptID.wager);
        });
        $("#wagerup").on('mousedown', function(ev2) {
          ev2.preventDefault();
          ev2.stopImmediatePropagation();
          ev2.stopPropagation();
          if (vptID.wager < vptID.credits) vptID.wager += 1;
          // $(this).off('touchend');
          // console.log('wagerup');
          if (vptID.gameStatus === 'draw' || vptID.gameStatus === 'bet') $("#wager").text(vptID.wager);
        });
        $("#wagerdown").on('touchend', function(ev1) {
          ev1.preventDefault();
          ev1.stopImmediatePropagation();
          ev1.stopPropagation();
          if (vptID.wager > 0) vptID.wager -= 1;
          // $(this).off('touchend');
          // console.log('wagerup');
          if (vptID.gameStatus === 'draw' || vptID.gameStatus === 'bet') $("#wager").text(vptID.wager);
        });
        $("#wagerdown").on('mousedown', function(ev1) {
          ev1.preventDefault();
          ev1.stopImmediatePropagation();
          ev1.stopPropagation();
          if (vptID.wager > 0) vptID.wager -= 1;
          // $(this).off('touchend');
          // console.log('wagerup');
          if (vptID.gameStatus === 'draw' || vptID.gameStatus === 'bet') $("#wager").text(vptID.wager);
        });
      }
      $(document).ready(dealButtonF);