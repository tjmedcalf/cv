var expressApp = require('express')();
var server = require('http').Server(expressApp);
var serveStatic = require('serve-static');
var io = require('socket.io')(server);
var socket = require('./socket-io.js');

module.exports = function(settingsJson) {
    server.listen(settingsJson.internalServerPort);
    expressApp.use("/", serveStatic(__dirname + "/content"));
    expressApp.use("/settings.json", serveStatic(__dirname + "/settings.json"));
    expressApp.use("/js", serveStatic(__dirname + "/node_modules"));

    socket(io);
};