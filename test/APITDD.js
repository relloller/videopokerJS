var assert = require('assert');
var mocha = require('mocha');
var request = require("request");
var base_url = "http://localhost:8080/api";
var jtoken = '';
var rnd = Math.floor((Math.random() * 9999999999999) + 1);
var guestName = 'guest' + rnd.toString();
var handTest1=[];

function asciiB64(asciiStr) {
    var buf = Buffer.from(asciiStr, 'ascii');
    return buf.toString('base64');
}



describe("videopokerjs", function() {

    describe('GET /api', function() {
        it("returns status code 200", function(done) {
            request.get(base_url, function(error, response, body) {
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it("returns 'videopokerjs API'", function(done) {
            request.get(base_url, function(error, response, body) {
                assert.equal("videopokerJS API", body);
                done();
            });
        });
    });

    describe("POST /api/register", function() {

        it("returns 200 status, username, credits, and JWT token", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/register',
                headers: {
                    'Authorization': 'Basic ' + asciiB64(guestName + ':' + guestName)
                },
                json: {
                    email: guestName
                }
            }, function(error, res, body) {
                var reg1 = body;
                assert.equal(res.statusCode, 200);
                assert.equal(typeof reg1.token, 'string');
                assert.equal(reg1.username, guestName);
                assert.equal(reg1.credits, 500);
                jtoken = reg1.token;
                done();
            })
        });

        it("returns code 409 and 'username exists' error message for duplicate username registration", function() {
            request({
                method: 'POST',
                uri: base_url + '/register',
                headers: {
                    'Authorization': 'Basic ' + asciiB64(guestName + ':' + guestName)
                },
                json: {
                    email: guestName
                }
            }, function(error, res, body) {
                assert.equal(res.statusCode, 409);
                assert.equal(body, 'username exists');
            })
        });

        it("/api/register returns 400 status for incomplete field(s)", function(done) {
            var rnd = Math.floor((Math.random() * 99999) + 1);
            var guestName = 'guest' + rnd.toString();
            request({
                method: 'POST',
                uri: base_url + '/register',
                headers: {
                    'Authorization': 'Basic ' + asciiB64(guestName + ':' + guestName)
                },
                json: {
                   
                }
            }, function(error, res, body) {
                assert.equal(res.statusCode, 400);
                assert.equal(body, 'All fields required');
                done();
            });
        });
    });

    describe("POST /api/login", function() {

        it("returns 200 status, username, credits, and JWT token", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/login',
                headers: {
                    'Authorization': 'Basic ' + asciiB64(guestName + ':' + guestName)
                },
                json: {
                    email: guestName
                }
            }, function(error, res, body) {
                var login1 = body;
                assert.equal(res.statusCode, 200);
                assert.equal(typeof login1.token, 'string');
                jtoken = login1.token;
                assert.equal(login1.username, guestName);
                assert.equal(login1.credits, 500);
                done();
            });
        });

        it("returns 401 status for incorrect password", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/login',
                headers: {
                    'Authorization': 'Basic ' + asciiB64(guestName + ':' + 'foobarpw')
                }
            }, function(error, res, body) {
                assert.equal(res.statusCode, 401);
                assert.equal(body, "Unauthorized: Access is denied due to invalid credentials.")
                done();
            });
        });
    });

    describe("POST /api/deal/user", function() {

        it("deals an array of 5 unique integers from 1-52", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/vp/deal/user',
                json: {
                    'wager': 5
                },
                headers: {
                    'x-access-token': jtoken
                }
            }, function(error, res, body) {
                // var h2 = body;
                handTest1 = body;
                // var hd2 = h2.dealHand;
                assert.equal(res.statusCode, 200);
                assert.equal(Array.isArray(body.dealHand), true);
                assert.equal(body.dealHand.length, 5);
                done();
            });
        });

        it("returns 401 status and 'Unauthorized: Invalid authentication token.'' message when using invalid JWT", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/vp/deal/user',
                json: {
                    'wager': 5
                },
                headers: {
                    'x-access-token': jtoken+'asdfasdf'
                }
            }, function(error, res, body) {
                console.log('error',error);
                assert.equal(res.statusCode, 401);
                assert.equal(body, "Unauthorized: Invalid authentication token.");
                done();
            });
        });
    });

    describe("POST /api/vp/draw/user", function() {
        it("returns 200 status, array of 5 integers, credits", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/vp/draw/user',
                json: {
                    'holdCards': [0, 0, 0, 0, 0],
                    'tID': handTest1.tID,
                },
                headers: {
                    'x-access-token': jtoken
                }
            }, function(error, res, body) {
                assert.equal(res.statusCode, 200);
                assert.equal(Array.isArray(body.drawHand), true);
                assert.equal(body.drawHand.length, 5);
                assert.equal(typeof body.credits, 'number');
                assert.equal(typeof body.handValue, 'string');
                // assert.equal(body.username, guestName);
                // assert.equal(typeof body.handValue, 'string');
                done();
            });
        });

        it("returns 400 status and 'Invalid input.' body for invalid cards", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/vp/draw/user',
                json: {
                    'holdCards': [52, 51, 50, 49, 40, 123, 21],
                    'tID': handTest1.tID,
                },
                headers: {
                    'x-access-token': jtoken
                }
            }, function(error, res, body) {
                assert.equal(res.statusCode, 400);
                assert.equal(body, 'Invalid input.');
                done();
            });
        });

        it("returns 404 status and 'Game not found' for invalid tID", function(done) {
            request({
                method: 'POST',
                uri: base_url + '/vp/draw/user',
                json: {
                    'holdCards': [0, 0, 0, 0, 0],
                    'tID': '1241',
                },
                headers: {
                    'x-access-token': jtoken
                }
            }, function(error, res, body) {
                assert.equal(res.statusCode, 404);
                assert.equal(body, 'Game not found');
                done();
            });
        });



        it("returns 404 status, 'Game with submitted tID closed' when trying to access finished game", function(done) {
          request({
            method: 'POST',
            uri: base_url + '/vp/draw/user',
            json: {
              'holdCards': [0, 0, handTest1.dealHand[2], 0, 0],
              'tID': handTest1.tID,
            },
            headers: {
              'x-access-token': jtoken
            }
          }, function(error, res, body) {
            assert.equal(res.statusCode,404);
            assert.equal(body,'Game with submitted tID closed');
            done();
          });
        });
    });
});
