var assert = require("assert");
var mockData = require("./mockData");

function assertResponseSuccess(response, done, expectedResult) {
    assert.equal("200", response.statusCode);
    var result = "";
    response.on("data", function (chunk) {
        result += chunk;
    });
    response.on("end", function () {
        assert.equal(expectedResult, result);
        done();
    });
}

describe("GET request", function () {
    it("should return success", function (done) {
        var http = require("http");
        http.get("http://localhost:9999", function (response) {
            assertResponseSuccess(response, done, "success");
        });
    });
});

function sendPostData(request, fileName) {
    var boundaryKey = Math.random().toString(16);
    request.setHeader('Content-Type', 'multipart/form-data; boundary="' + boundaryKey + '"');
    request.write(
        '--' + boundaryKey + '\r\n'
            // use your file's mime type here, if known
            + 'Content-Type: application/octet-stream\r\n'
            // "name" is the name of the form field
            // "filename" is the name of the original file
            + 'Content-Disposition: form-data; name="uploadedFile"; filename="' + fileName + '"\r\n'
            + 'Content-Transfer-Encoding: binary\r\n\r\n'
    );
    var fs = require("fs");
    fs.createReadStream('./' + fileName, { bufferSize: 4 * 1024 })
        .on('end', function () {
            // mark the end of the one and only part
            request.end('\r\n--' + boundaryKey + '--');
            console.log("createReadStream complete. ");
        })
        // set "end" to false in the options so .end() isn't called on the request
        .pipe(request, { end: false }) // maybe write directly to the socket here?
}

describe("Upload something", function () {

    var http = require("http");
    var options = {
        hostname: "localhost",
        port: 9999,
        path: "/upload",
        method: "POST"
    };

    it("send POST request with actual data should see an uploaded file in repository folder", function (done) {
        var request = http.request(options, function (response) {
            assert.equal("200", response.statusCode);

            var result = "";
            response.on('data', function (chunk) {
                result += chunk;
            });
            response.on("end", function () {
                assert.equal("success", result);
                assertExistFile(mockData.containedFolderPath + mockData.fileName, done);
            });
        });
        sendPostData(request, mockData.containedFolderPath + mockData.fileName);
    });

    it("send POST request without actual data should return success", function(done){
        var request = http.request(options, function(response) {
            assertResponseSuccess(response, done, "success");
        });
        request.end();
    });

    after(function(){//It will be applied to current "Asynchronous setTimeout()" scope.
        deleteFile("temp/" + mockData.fileName);
    });
});

describe("List all thing", function(){
    it("should return a list", function(done){
        var http = require("http");
        http.get("http://localhost:9999/list", function (response) {
            assert.equal("200", response.statusCode);
            var result = "";
            response.on("data", function (chunk) {
                result += chunk;
            });
            response.on("end", function () {
                assert.ok(result.length > 100);
                done();
            });
        });
    });
});

function assertExistFile(filePath, done) {
    var fs = require("fs");
    fs.readFile(filePath, "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        assert.equal(5, data.length);
        done();
    });
}

function deleteFile(filePath) {
    var fs = require('fs');
    fs.unlink(filePath, function (err) {
        if (err) throw err;
        console.log("successfully deleted " + filePath);
    });
}



