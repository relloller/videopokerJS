var request = require("request");
var base_url = "http://localhost:8080/api";
var jtoken = '';
describe("vegas.codes Server", function() {
  describe("GET /", function() {
    it("returns status code 200 from /api", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("returns vegas.codes API from /api", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(body).toBe("vegas.codes API");
        done();
      });
    });

    it("/api/vp/deal/guest returns status code 200", function(done) {
      request.get(base_url + '/vp/deal/guest', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("/api/vp/deal/guest returns array of 5 integers from 1-52", function(done) {
      request.get(base_url + '/vp/deal/guest', function(error, response, body) {
        var h = JSON.parse(body);
        var hd = h.dealHand;
        expect(Array.isArray(hd)).toBe(true);
        expect(hd[0]).toBeGreaterThan(0);
        expect(hd[1]).toBeGreaterThan(0);
        expect(hd[2]).toBeGreaterThan(0);
        expect(hd[3]).toBeGreaterThan(0);
        expect(hd[4]).toBeGreaterThan(0);
        expect(hd[0]).toBeLessThan(53);
        expect(hd[1]).toBeLessThan(53);
        expect(hd[2]).toBeLessThan(53);
        expect(hd[3]).toBeLessThan(53);
        expect(hd[4]).toBeLessThan(53);
        done();
      });
    });


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
        // console.log('jtoken',jtoken);
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
        // console.log('responseme',response);
        // var me = JSON.parse(body);
        // console.log('me', me);
        expect(response.statusCode).toBe(401);
        expect(body).toBe('Access Denied');
        done();
      });
    });

    it("/api/vp/deal/user returns 200 status, username, credits", function(done) {
      request({
        method: 'GET',
        uri: base_url + '/vp/deal/user',
        headers: {
          'x-access-token': jtoken
        }
      }, function(error, response, body) {
        var h2 = JSON.parse(body);
        console.log('h2',h2);
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

    it("/api/register returns 201 status, username, credits, and JWT token", function(done) {
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
        expect(response.statusCode).toBe(201);
        expect(typeof reg1.token).toBe('string');
        expect(reg1.username).toBe(guestName);
        expect(typeof reg1.credits).toBe('number')
        done();
      });
    });
  });
});