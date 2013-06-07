var fs = require("fs");
var assert = require("assert");

describe("Temp folder", function(){
    it("should contain a ok.bin file", function(done){
        fs.readFile("temp/ok.bin", "utf8", function (err,data) {
            if (err) {
                return console.log(err);
            }
            assert.ok(data.length > 0);
            done();
        });

    });
});
