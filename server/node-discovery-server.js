#!/usr/bin/env node

/**
 * node-finder server
 * the one to be looking for
 * 
 * Created by lonord on 16/5/21.
 */
var dgram = require("dgram");
var server = dgram.createSocket("udp4");

var defaultConfigList = [
    "serverPort",
    "clientPort",
    "idString",
    "responseString"
];

//load config
var config;
try {
    config = require('./config_server.json');
    defaultConfigList.forEach(function(item) {
        if (!config[item]) {
            throw new Error('configuration porperty \'' + item + '\' not found.');
        }
    });
}
catch (ignore) {
    throw new Error('configuration file \'config_server.json\' not found.');
}

server.on("error", function (err) {
    if(err){
        console.log(err);
    }
    server.close();
});
server.on("message", function (msg, rinfo) {
    console.log("got broadcast: " + msg + " from " +
        rinfo.address + ":" + rinfo.port);
    if(msg.toString() === config.idString) {
        var str = config.responseString;
        if (config.additionalString) {
            str = str + ':' + config.additionalString;
        }
        var message = Buffer.from(str);
        server.send(message, 0, message.length, config.clientPort, rinfo.address, function (err, bytes) {
            if (err) {
                console.log('reply mess err:' + err);
            }
        });
    }
});
server.on("listening", function () {
    var address = server.address();
    console.log("server listening broadcast on " +
        address.address + ":" + address.port);
});

server.bind(config.serverPort);
