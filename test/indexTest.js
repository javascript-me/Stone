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