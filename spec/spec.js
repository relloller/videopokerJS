var request = require("request");
var base_url = "http://localhost:8080/api"
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
    it("returns status code 200 from /api/vp/deal", function(done) {
      request.get(base_url+'/vp/deal', function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
    it("returns array of 5 integers from 1-52 /api/vp/deal", function(done) {
      request.get(base_url+'/vp/deal', function(error, response, body) {
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
  });
});