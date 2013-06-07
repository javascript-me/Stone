var fs = require("fs");
var assert = require("assert");
var mockData = require("./mockData");

describe("Temp folder", function(){
    it("should contain a ok.bin file", function(done){
        onUploadSuccess(done);
    });
});

function onUploadSuccess(done){
    fs.readFile("temp/" + mockData.fileName, "utf8", function (err,data) {
        if (err) {
            return console.log(err);
        }
        assert.ok(data.length > 0);
        done();
    });
}

exports.onUploadSuccess = onUploadSuccess;