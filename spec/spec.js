var request = require("request");

var base_url = "http://localhost:8080/api"

describe("vegas.codes Server", function() {
	describe("GET /", function() {
    it("returns status code 200", function(done) {
	      request.get(base_url, function(error, response, body) {
	      	        expect(response.statusCode).toBe(200);
	      	        done();
	      });
    });
     it("returns vegas.codes API", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(body).toBe("vegas.codes API");
        done();
      });
    });
  });
});