#!/usr/bin/env node

/**
 * node-finder client
 * the one to look for
 * 
 * Created by lonord on 16/5/21.
 */

var dgram = require("dgram");
var udp = dgram.createSocket("udp4");

var defaultConfigList = [
    "serverPort",
    "clientPort",
    "idString",
    "responseString",
    "timeout"
];

//load config
var config;
try {
    config = require('./config_client.json');
    defaultConfigList.forEach(function(item) {
        if (!config[item]) {
            throw new Error('configuration porperty \'' + item + '\' not found.');
        }
    });
}
catch (ignore) {
    throw new Error('configuration file \'config_client.json\' not found.');
}

var found = false;

var timer_id = setTimeout(function() {
    if (!found) {
        console.log('time out');
    }
    console.log('\n');
    process.exit();
}, config.timeout);


udp.on("error", function (err) {
    if(err){
        console.log(err);
    }
    udp.close();
    process.exit();
});
udp.on("message", function (msg, rinfo) {
    var msgArray = msg.toString().split(':');
    var msgTitle = msgArray[0];
    var msgContent = msgArray[1];
    if(msgTitle === config.responseString){
        if (!found) {
            console.log('****** found target ******');
        }
        console.log('   ' + rinfo.address + (msgContent ? ': ' + msgContent : ''));
        found = true;
    }
});

udp.bind(config.clientPort, function () {
    udp.setBroadcast(true);
});

var broadcastAddr = '255.255.255.255';
if(config.broadcastAddr){
    broadcastAddr = config.broadcastAddr;
}

console.log('broadcast on:' + broadcastAddr + ' ...\n');
var message = Buffer.from(config.idString);
udp.send(message, 0, message.length, config.serverPort, broadcastAddr, function(err, bytes) {
    if(err){
        console.log('broadcast mess err:' + err);
        process.exit();
    }
});
