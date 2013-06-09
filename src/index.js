var http = require("http");
var url = require("url");
var formidable = require("formidable");
var fs = require("fs");
var util = require('util');

function hasFile(files) {
    return Object.keys(files).length > 0;
}

exports.hasFile = hasFile;

function getPhysicalFileName(filePath) {
    var lastIndexOfSlash = filePath.lastIndexOf("/");
    return filePath.substring(lastIndexOfSlash + 1, filePath.length);
}

exports.getPhysicalFileName = getPhysicalFileName;

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
//            var myJSONText = JSON.stringify({fields: fields, files: files});
//            console.log(myJSONText);

            if (hasFile(files)) {
                var physicalFileName = getPhysicalFileName(files.uploadedFile.name);

                fs.rename(files.uploadedFile.path, "temp/" + physicalFileName, function (err) {
                    if (err) {
                        console.log("Start fs.unlink");
                        fs.unlink("ok.bin", function (err) {
                            console.log("Error: unlink. ");
                        });
                        fs.rename(files.uploadedFile.path, "temp/" + physicalFileName);
                    }
                });
            }

            response.writeHead(200, {"Content-Type": "text/html"});
            response.write("success");
            response.end();
        });
    }

    if (pathname == "/list") {
        response.writeHead(200, {"Content-Type": "text/html"});

        fs.readdir("temp", function(err, files){
            if(err){
                console.log("readdir error");
            }
            console.log(util.inspect(files));

            var content = "";
            for(var i = 0 ; i < files.length ; i++){
                var tgzFileName = files[i];
                content += tgzFileName + '<br />';
                content += '<a href="/deploy?tgzFileName=' + tgzFileName + '">deploy</a>' + "<br />";
            }

            var body = '<html>' +
                '<head>' +
                '<meta http-equiv="Content-Type" ' +
                'content="text/html; charset=UTF-8" />' +
                '</head>' +
                '<body>' +
                content +

                '</body>' +
                '</html>';

            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(body);
            response.end();
        });

//        var result = {
//            all: [
//                {tgzFileName: "image-home-0.0.2.tgz"},
//                {tgzFileName: "image-home-0.0.3.tgz"},
//                {tgzFileName: "image-home-0.0.4.tgz"}
//            ]
//        };

//        var content = "";
//        for(var i = 0 ; i < files.length ; i++){
//            var tgzFileName = files[i];
//            content += tgzFileName + '<br />';
//            content += '<a href="/deploy?tgzFileName=' + tgzFileName + '">deploy</a>' + "<br />";
//        }

        //=======================
//        var body = '<html>' +
//            '<head>' +
//            '<meta http-equiv="Content-Type" ' +
//            'content="text/html; charset=UTF-8" />' +
//            '</head>' +
//            '<body>' +
//            result.all[0].tgzFileName + '<br />' +
//            '<a href="/deploy?tgzFileName=' + result.all[0].tgzFileName + '">deploy</a>' + "<br />" +
//
//            result.all[1].tgzFileName + '<br />' +
//            '<a href="/deploy?tgzFileName=' + result.all[1].tgzFileName + '">deploy</a>' + "<br />" +
//
//            result.all[2].tgzFileName + '<br />' +
//            '<a href="/deploy?tgzFileName=' + result.all[2].tgzFileName + '">deploy</a>' + "<br />" +
//
//            '</body>' +
//            '</html>';

//        var body = '<html>' +
//            '<head>' +
//            '<meta http-equiv="Content-Type" ' +
//            'content="text/html; charset=UTF-8" />' +
//            '</head>' +
//            '<body>' +
//            content +
//
//            '</body>' +
//            '</html>';
//
//        response.writeHead(200, {"Content-Type": "text/html"});
//        response.write(body);
//        response.end();
    }

    if (pathname == "/deploy") {

        var querystring = require("querystring");


        console.log("request.url: " + request.url);
        var query = url.parse(request.url).query;
        console.log("query: " + query);

        var inputParameters = querystring.parse(query, sep = '&', eq = '=')
        //把文件从temp目录复制到target目录。
        console.log("tgzFileName: " + inputParameters.tgzFileName);


        var is = fs.createReadStream("temp/" + inputParameters.tgzFileName);
        var os = fs.createWriteStream("target/" + inputParameters.tgzFileName);

        util.pump(is, os, function (err) {
            if (err) {
                console.log("Copy Error! ");
            }
            var tarball = require('tarball-extract');
            tarball.extractTarball("target/" + inputParameters.tgzFileName, 'target/image-home', function (err) {
                if (err) console.log(err);

                var sys = require('sys')
                var exec = require('child_process').exec;

                function puts(error, stdout, stderr) {
                    sys.puts(stdout)
                }

                //exec("node target/image-home/package/src/index.js", puts);
                exec("cd target/image-home/package/src && node index.js", puts);
//                exec("cd target/image-home/package/src", puts);
//                exec("node index.js", puts);


                response.writeHead(200, {"Content-Type": "text/html"});
                response.write("deploy success");
                response.end();
            })

        });


    }

}

http.createServer(onRequest).listen(9999);
console.log("Server start at http://localhost:9999");

