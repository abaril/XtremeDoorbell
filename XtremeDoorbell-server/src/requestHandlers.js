// Copyright (c) 2012 Allan Baril
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
// and associated documentation files (the "Software"), to deal in the Software without restriction, 
// including without limitation the rights to use, copy, modify, merge, publish, distribute, 
// sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or 
// substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
// NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var winston = require("winston");
var fs = require("fs");
var url = require("url");
var tcpserver = require("./tcpserver");

var indexHTML;
var jquery;
var css;

function init(settings) {
	fs.readFile(settings.html_directory + "index.html", function(error, content) {
		indexHTML = content;
	});
	fs.readFile(settings.html_directory + "jquery-1.7.1.js", function(error, content) {
		jquery = content;
	});
	fs.readFile(settings.html_directory + "index.css", function(error, content) {
		css = content;
	});
}

// TODO: find a better way to serve static content ...
function index(response, request) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(indexHTML);
    response.end();
}

function jquery(response, request) {
    response.writeHead(200, {"Content-Type": "text/javascript"});
    response.write(jquery);
    response.end();
}

function css(response, request) {
    response.writeHead(200, {"Content-Type": "text/css"});
    response.write(css);
    response.end();
}

function audio(response, request) {
    var components = request.url.split("/");
    var file = "test.mp3";
    if (components.length > 2) {
        file = components[components.length - 1];
    }
    
    var path = "audio/" + file;
    winston.debug("Playing audio file " + path);

    var first = true;
    fs.createReadStream(path, {'flags': 'r', 'encoding': 
                            'binary', 'mode': 0666, 'bufferSize': 64 * 1024})
      .addListener("data", function(chunk) {
         if (first) {
            response.writeHead(200, {"Content-Type": "audio/mpeg3"});
            first = false;
         }
         response.write(chunk, 'binary');
      })
      .addListener("error", function() {
         response.writeHead(404, {"Content-Type": "text/html"});
         response.write("Unable to locate audio file " + file);
         response.end();
      })
      .addListener("close",function() {
         response.end();
      });
}

function clients(response, request) {
    winston.debug("Request for client list");

    response.writeHead(200, {"Content-Type": "text/javascript"});
    response.write(JSON.stringify({clients: tcpserver.clients()}));
    response.end();
}

function fire(response, request) {
    var params = url.parse(request.url, true).query;
    var inputURL = "";
    
    if ((typeof params["url"]) === "string") {
        inputURL = params["url"];
    }
    winston.info("Triggering doorbell with URL=" + inputURL);
    
    response.writeHead(200, {"Content-Type": "text/javascript"});
    if (inputURL !== "") {
        tcpserver.play(inputURL);
        response.write('{"status": "OK"}');
    } else {
        response.write('{"status": "Failed", "error": "Missing or invalid URL", "errorCode": 1000}');
    }
    response.end();
}

exports.init = init;
exports.index = index;
exports.jquery = jquery;
exports.css = css;
exports.audio = audio;
exports.clients = clients;
exports.fire = fire;
