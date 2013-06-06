var http = require("http");
var url = require("url");
var formidable = require("formidable");
var fs = require("fs");
var util = require('util');

function onRequest(request, response) {

    var pathname = url.parse(request.url).pathname;

    console.log("Processing pathname: " + pathname);

    if (pathname == "/") {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("success");
        response.end();
    }

    if (pathname == "/upload") {
        var form = new formidable.IncomingForm();
        form.parse(request, function (error, fields, files) {

            console.log(util.inspect({fields: fields, files: files}));

            if(files != undefined){

                fs.rename(files.my_file.path, "ok.bin", function (err) {
                    if (err) {
                        console.log("Start fs.unlink");
                        fs.unlink("ok.bin", function(err){
                            console.log("Error: unlink. ");
                        });
                        fs.rename(files.my_file.path, "ok.bin");
                    }
                });
            }

            response.writeHead(200, {"Content-Type": "text/html"});
            response.write("success upload");
            response.end();
        });
    }
}

http.createServer(onRequest).listen(9999);
console.log("Server start at http://localhost:9999");

