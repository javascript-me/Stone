var assert = require("assert");
var mockData = require("./mockData");

describe("GET request", function () {
    it("should return success", function (done) {
        var http = require("http");
        http.get("http://localhost:9999", function (response) {
            assert.equal("200", response.statusCode);

            var result = "";
            response.on("data", function (chunk) {
                result += chunk;
            });
            response.on("end", function () {
                assert.equal("success", result);
            });
            done();
        });
    });
});

describe("POST request with real data", function () {
    it("should see a file in temp folder", function (done) {

        var http = require("http");
        var fs = require("fs");

        var options = {
            hostname: "localhost",
            port: 9999,
            path: "/upload",
            method: "POST",
            'content-length': 294
        };

        var request = http.request(options, function (response) {
            assert.equal("200", response.statusCode);

            var result = "";
            response.on('data', function (chunk) {
                result += chunk;
            });
            response.on("end", function () {
                assert.equal("success upload", result);
                var existFileTest = require("./existFileTest");
                existFileTest.onUploadSuccess(done);
            });
        });

        var fileName = mockData.fileName;

        var boundaryKey = Math.random().toString(16); // random string
        request.setHeader('Content-Type', 'multipart/form-data; boundary="' + boundaryKey + '"');
// the header for the one and only part (need to use CRLF here)
        request.write(
            '--' + boundaryKey + '\r\n'
                // use your file's mime type here, if known
                + 'Content-Type: application/octet-stream\r\n'
                // "name" is the name of the form field
                // "filename" is the name of the original file
                + 'Content-Disposition: form-data; name="uploadedFile"; filename="' + fileName + '"\r\n'
                + 'Content-Transfer-Encoding: binary\r\n\r\n'
        );
        fs.createReadStream('./' + fileName, { bufferSize: 4 * 1024 })
            .on('end', function () {
                // mark the end of the one and only part
                request.end('\r\n--' + boundaryKey + '--');
                console.log("createReadStream complete. ");
            })
            // set "end" to false in the options so .end() isn't called on the request
            .pipe(request, { end: false }) // maybe write directly to the socket here?
    });
});

describe("POST request", function(){
   it("should return success", function(done){

       var http = require("http");

       var options = {
           hostname: "localhost",
           port: 9999,
           path: "/upload",
           method: "POST"
       };

       var request = http.request(options, function(response) {
           assert.equal("200", response.statusCode);

           var result = "";
           response.on('data', function (chunk) {
               result += chunk;
           });
           response.on("end", function(){
               assert.equal("success upload", result);
               done();
           });
       });

       request.write('data\n');
       request.write('data\n');
       request.end();
   });
});



