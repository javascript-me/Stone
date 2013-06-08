

//var fileName = process.argv.splice(2)[0];
//console.log(fileName);

var http = require("http");
var fs = require("fs");

var options = {
    hostname: "localhost",
    port: 9999,
    path: "/upload",
    method: "POST",
    'content-length': 294
};

start();

function start(){

    var request = http.request(options, function (response) {
        var result = "";
        response.on('data', function (chunk) {
            result += chunk;
        });
        response.on("end", function () {
        });
    });

    fs.readFile("package.json", "binary", function (error, file) {
        var content = file.toString();
        var myObject = JSON.parse(content);

        if (error) {

        } else {
            console.log("content: " + myObject.version);
            var fileName = myObject.name + "-" + myObject.version + ".tgz"
            console.log("==>" + fileName);
            sendPostData(request, fileName);
        }
    });
}

function sendPostData(request, fileName) {
//    var fileName = mockData.fileName;
    var boundaryKey = Math.random().toString(16);
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