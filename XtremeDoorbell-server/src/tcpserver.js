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
var net = require("net");

var clientSockets = [];

function start(settings) {

    var server = net.createServer(function(socket) {
        socket.name = socket.remoteAddress + ":" + socket.remotePort;
        winston.info("Client @ " + socket.name + " connected");
        
        socket.setKeepAlive(true, 120000);
        clientSockets.push(socket);
        
        socket.on("data", function(data) {
            // handle incoming data.
        });
        socket.on("end", function() {
            winston.info("Client @ " + socket.name + " disconnected");
        });
	socket.on("error", function(error) {
	    winston.info("Socket error: " + error);
	});
        socket.on("close", function(had_error) {
            winston.info("Socket error: " + error);
            clientSockets.splice(clientSockets.indexOf(socket), 1);            
        });
    });
    
    server.listen(settings.client_port, function() {
        winston.info("Client connections accepted at: " + settings.client_port);
    });
}

function clients() {
    var clientList = [];
    for (i = 0; i < clientSockets.length; ++i) {
        var clientObj = {};
        clientObj.address = clientSockets[i].name;
        clientList.push(clientObj);
    }
    return clientList;
}

function play(audioURL) {
    var payload = {};
    payload.command = "play";
    payload.url = audioURL;
    
    for (i = 0; i < clientSockets.length; ++i) {
        clientSockets[i].write(JSON.stringify(payload));
    }
}

exports.start = start;
exports.clients = clients;
exports.play = play;
