/** ./spec/spec.js  videopokerJS**/
var request = require("request");
var base_url = "http://localhost:8080/api";
var jtoken = '';
var handTest1 = {};
describe("vegas.codes Server", function() {
  describe("GET /api", function() {
    it("returns status code 200", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
    it("returns 'vegas.codes API'", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(body).toBe("vegas.codes API");
        done();
      });
    });
  });
  // describe("POST /api/vp/deal/guest", function() {
  //   it("/api/vp/deal/guest returns status code 200", function(done) {
  //     request.post(base_url + '/vp/deal/guest', function(error, response, body) {
  //       expect(response.statusCode).toBe(200);
  //       done();
  //     });
  //   });
  //   it("/api/vp/deal/guest returns array of 5 integers from 1-52", function(done) {
  //     request({
  //       method: 'POST',
  //       uri: base_url + '/vp/deal/guest',
  //     }, function(error, response, body) {
  //       var h = JSON.parse(body);
  //       var hd = h.dealHand;
  //       expect(Array.isArray(hd)).toBe(true);
  //       expect(hd[0]).toBeGreaterThan(0);
  //       expect(hd[1]).toBeGreaterThan(0);
  //       expect(hd[2]).toBeGreaterThan(0);
  //       expect(hd[3]).toBeGreaterThan(0);
  //       expect(hd[4]).toBeGreaterThan(0);
  //       expect(hd[0]).toBeLessThan(53);
  //       expect(hd[1]).toBeLessThan(53);
  //       expect(hd[2]).toBeLessThan(53);
  //       expect(hd[3]).toBeLessThan(53);
  //       expect(hd[4]).toBeLessThan(53);
  //       done();
  //     });
  //   });
  // });
  describe("POST /api/login", function() {
    it("/api/login returns 200 status, username, credits, and JWT token", function(done) {
      request({
        method: 'POST',
        uri: base_url + '/login',
        json: {
          username: 'guest001',
          password: 'guest001'
        }
      }, function(error, response, body) {
        var login2 = body;
        expect(response.statusCode).toBe(200);
        expect(typeof login2.token).toBe('string');
        jtoken = login2.token;
        expect(login2.username).toBe('guest001');
        expect(typeof login2.credits).toBe('number')
        done();
      });
    });
    it("/api/login returns 401 status for incorrect password", function(done) {
      request({
        method: 'POST',
        uri: base_url + '/login',
        json: {
          username: 'guest001',
          password: 'waefawefawefklasdf'
        }
      }, function(error, response, body) {
        var login1 = body;
        expect(response.statusCode).toBe(401);
        expect(login1.message).toBe('Incorrect password.');
        done();
      });
    });
  });
  describe("GET /api/me", function() {
    it("/api/me returns 200 status, username, credits", function(done) {
      request({
        method: 'GET',
        uri: base_url + '/me',
        headers: {
          'x-access-token': jtoken
        }
      }, function(error, response, body) {
        var me = JSON.parse(body);
        expect(response.statusCode).toBe(200);
        expect(me.username).toBe('guest001');
        expect(me.email).toBe('guest001@vegas.codes');
        expect(me.role).toBe('player');
        expect(typeof me.credits).toBe('number')
        done();
      });
    });
    it("/api/me returns 401 status and 'Access Denied' without valid JWT", function(done) {
      request({
        method: 'GET',
        uri: base_url + '/me',
        // headers: {
        //   'x-access-token': jtoken
        // }
      }, function(error, response, body) {
        expect(response.statusCode).toBe(401);
        expect(body).toBe('Access Denied');
        done();
      });
    });
  });
  describe("POST /api/vp/deal/user", function() {
    it("/api/vp/deal/user returns 200 status, username, credits", function(done) {
      request({
        method: 'POST',
        uri: base_url + '/vp/deal/user',
        json: {
          'wager': 5
        },
        headers: {
          'x-access-token': jtoken
        }
      }, function(error, response, body) {
        var h2 = body;
        handTest1 = h2;
        var hd2 = h2.dealHand;
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(hd2)).toBe(true);
        expect(hd2[0]).toBeGreaterThan(0);
        expect(hd2[1]).toBeGreaterThan(0);
        expect(hd2[2]).toBeGreaterThan(0);
        expect(hd2[3]).toBeGreaterThan(0);
        expect(hd2[4]).toBeGreaterThan(0);
        expect(hd2[0]).toBeLessThan(53);
        expect(hd2[1]).toBeLessThan(53);
        expect(hd2[2]).toBeLessThan(53);
        expect(hd2[3]).toBeLessThan(53);
        expect(hd2[4]).toBeLessThan(53);
        done();
      });
    });
    it("/api/vp/deal/user w/ invalid JWT returns 401 status and 'invalid token'", function(done) {
      request({
        method: 'POST',
        uri: base_url + '/vp/deal/user',
        json: {
          'wager': 5
        },
        headers: {
          'x-access-token': 'eyJhGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1ZXN0MDAxIiwicm9sZSI6InBsYXllciIsImV4cCI6MTQ2OTYwNjI0OSwiaWF0Ijox4DY5NTE5ODQ5fQ.HsGfDk4i9Bgj7ckru3smd7Zardif-fycmzZweXlsppU'
        }
      }, function(error, response, body) {
        expect(response.statusCode).toBe(401);
        expect(body).toBe('invalid token');
        done();
      });
    });
  });
  describe("POST /api/vp/draw/user", function() {
    it("/api/vp/draw/user returns 405 status and 'Invalid input' body for invalid cards", function(done) {
      request({
        method: 'POST',
        uri: base_url + '/vp/draw/user',
        json: {
          'holdCards': [52, 51, 50, 49, 40],
          'tID': handTest1.tID,
        },
        headers: {
          'x-access-token': jtoken
        }
      }, function(error, response, body) {
        expect(response.statusCode).toBe(405);
        expect(body).toBe('Invalid input');
        done();
      });
    });
    it("/api/vp/draw/user returns 404 status and 'Invalid input' body for invalid tID", function(done) {
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
      }, function(error, response, body) {
        expect(response.statusCode).toBe(404);
        expect(body).toBe('Game not found');
        done();
      });
    });
    it("/api/vp/draw/user returns 200 status, username, credits", function(done) {
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
      }, function(error, response, body) {
        var hdr = body.drawHand;
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(hdr)).toBe(true);
        expect(hdr[0]).toBeGreaterThan(0);
        expect(hdr[1]).toBeGreaterThan(0);
        expect(hdr[2]).toBeGreaterThan(0);
        expect(hdr[3]).toBeGreaterThan(0);
        expect(hdr[4]).toBeGreaterThan(0);
        expect(hdr[0]).toBeLessThan(53);
        expect(hdr[1]).toBeLessThan(53);
        expect(hdr[2]).toBeLessThan(53);
        expect(hdr[3]).toBeLessThan(53);
        expect(hdr[4]).toBeLessThan(53);
        expect(typeof body.win).toBe('number');
        expect(typeof body.credits).toBe('number');
        expect(typeof body.handValue).toBe('string');
        done();
      });
    });
    it("/api/vp/draw/user returns 404 status, 'Game with submitted tID closed'", function(done) {
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
      }, function(error, response, body) {
        expect(response.statusCode).toBe(404);
        expect(body).toBe('Game with submitted tID closed');
        done();
      });
    });
  });
  describe("POST /api/register", function() {
    it("/api/register returns 200 status, username, credits, and JWT token", function(done) {
      var rnd = Math.floor((Math.random() * 99999) + 1);
      var guestName = 'guest' + rnd.toString();
      request({
        method: 'POST',
        uri: base_url + '/register',
        json: {
          username: guestName,
          password: guestName,
          email: guestName + "@vegas.codes"
        }
      }, function(error, response, body) {
        var reg1 = body;
        expect(response.statusCode).toBe(200);
        expect(typeof reg1.token).toBe('string');
        expect(reg1.username).toBe(guestName);
        expect(typeof reg1.credits).toBe('number')
        done();
      });
    });
    it("/api/register returns 400 status for incomplete field(s)", function(done) {
      var rnd = Math.floor((Math.random() * 99999) + 1);
      var guestName = 'guest' + rnd.toString();
      request({
        method: 'POST',
        uri: base_url + '/register',
        json: {
          username: guestName,
          password: guestName
        }
      }, function(error, response, body) {
        expect(response.statusCode).toBe(400);
        expect(body).toBe('All fields required')
        done();
      });
    });
  });
});