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
var tcpserver = require("./tcpserver");
var requestHandlers = require("./requestHandlers");
var server = require("./server");
var router = require("./router");

var settings = {
    "client_port": process.env.PORT||9001,
    "http_listen_port": process.env.PORT||9000,
    "html_directory": "html/",
    "audio_directory": "audio/"    
};

winston.setLevels(winston.config.syslog.levels);
winston.add(winston.transports.File, {
        "filename": "log/server.log",
        "handleExceptions": true,
        "level": "info"
});

winston.info("Settings = " + JSON.stringify(settings));

process.on('uncaughtException', function(err) {
  winston.log(err);
});

tcpserver.start(settings);

requestHandlers.init(settings);
var handle = {}
handle["/"] = requestHandlers.index;
handle["/jquery-1.7.1.js"] = requestHandlers.jquery;
handle["/index.css"] = requestHandlers.css;
handle["/clients"] = requestHandlers.clients;
handle["/fire"] = requestHandlers.fire;
handle["/audio[/.*]"] = requestHandlers.audio;

server.start(settings, router.route, handle);