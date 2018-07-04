"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var app_1 = require("./app");
var server = http.createServer(app_1.default);
var port = 4000;
server.listen(port, function () { return console.log('im running on port', port); });
var io = require('socket.io')(server);
io.on('connection', function (socket) {
    console.log('new connection:', socket.id);
    socket.on('chat', function () {
        io.sockets.emit('chat');
    });
    socket.on('disconnect', function () {
        console.log('disconnect:', socket.id);
    });
});
//# sourceMappingURL=index.js.map