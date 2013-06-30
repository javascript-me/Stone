var assert = require("assert");
var index = require("../src/index.js");

describe("Index", function(){
    it("should has file for {a:'ok''}", function(){
        assert.ok(index.hasFile({a:"ok"}));
    });

    it("should not has file for {}", function(){
        assert.ok(!index.hasFile({}));
    });
});

describe("Physical file name of test/mockData.js", function(){
    it("should be mockData.js", function(){
        assert.equal("mockData.js", index.getPhysicalFileName("test/mockData.js"));
        assert.equal("ok.js", index.getPhysicalFileName("test/ok.js"));
    });
});

describe("Main name of image-home-0.0.1.tgz", function(){
    it("should be image-home", function(){
        assert.equal("image-home", index.toMainName("image-home-0.0.11.tgz"));
    })
});