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
var exec = require('child_process').exec;

var client;
var clientState = 0;
var watchdogTimer;

function start(settings) {
    watchdog(settings);
}

function watchdog(settings) {
    winston.debug("Watchdog");
    watchdogTimer = setTimeout(watchdog, 5000, settings);    
    if (!client || clientState === 0) {
        winston.info("Attempting to connect to server");
        establishConnection(settings);
    }
}

function establishConnection(settings) {
    client = new net.Socket();
    
    client.connect(settings.server_port, settings.server_address, function() {
        clientState = 2;
        winston.info("Connected to server");
    });
    clientState = 1;
    
    client.on('data', function(data) {
        winston.info("Received: " + data);
        var request = JSON.parse(data);
        if (request.command === "play") {
            play(settings.audio_player, request.url);        
        }
    });
    client.on('error', function() {
        winston.info("Error");
        clientState = 0;
    });
    client.on('close', function() {
        winston.info("Connection closed");
        clientState = 0;
    });
    
    return client;
}

function play(audio_player, url)
{
    winston.info("Play " + url + " with " + audio_player);
    exec(audio_player + " " + url, function(error) {
        if (error != null) {
            winston.warn('Unable to execute command' + error);
        }
    });
}

exports.start = start;