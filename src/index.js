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

function toMainName(tgzFileName){
    var lastIndexOfDash = tgzFileName.lastIndexOf("-");
    return tgzFileName.substr(0, lastIndexOfDash);
}

exports.toMainName = toMainName;

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

            console.log("<<<<<<<<<<<<<<<<<<<");
            console.log(util.inspect({fields: fields, files: files}));
            console.log(">>>>>>>>>>>>>>>>>");

            if (hasFile(files)) {
                var physicalFileName = getPhysicalFileName(files.uploadedFile.name);

                fs.rename(files.uploadedFile.path, "temp/" + physicalFileName, function (err) {
                    if (err) {
                        console.log("Start fs.unlink");
                        fs.unlink(files.uploadedFile.path, function (err) {
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
            //把image-home这名字从tgzFileName里提取出来。
            var mainName = toMainName(inputParameters.tgzFileName);
            tarball.extractTarball("target/" + inputParameters.tgzFileName, 'target/' + mainName, function (err) {
                if (err) console.log(err);

                var sys = require('sys')
                var exec = require('child_process').exec;

                function puts(error, stdout, stderr) {
                    sys.puts(stdout);
                    console.log("[error]" + error);
                    console.log("[stdout]" + stdout);
                    console.log("[stderr]" + stderr);
                }
                //把package这一层目录去掉。
                exec("cd target/" + mainName + "/package && nodemon src/index.js &", puts);

                response.writeHead(200, {"Content-Type": "text/html"});
                response.write("deploy success");
                response.end();
                console.log("Deployment Complete==============================");
            })

        });


    }

}

http.createServer(onRequest).listen(9999);
console.log("Server start at http://localhost:9999");

