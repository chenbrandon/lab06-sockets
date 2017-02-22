"use strict";
var net = require("net");
var ip = require("ip");
;
var server = net.createServer();
var clients = [];
server.on('connection', function (socket) {
    function broadcast(name, message) {
        clients.forEach(function (client) {
            if (client !== socket) {
                client.write('[' + name + ']' + message + '\n');
            }
        });
    }
    console.log('connected to :' + socket.remoteAddress);
    clients.push(socket);
    socket.write("What is your name? \n");
    var name = '';
    socket.on('data', function (data) {
        var message = data.toString();
        if (message.length === 0) {
            socket.write('(type something nad hit return) \n');
            return;
        }
        if (!name) {
            name = data.toString().substr(0, 10);
            socket.write("Hello " + name + '\n');
            socket.write('There are ' + clients.length + ' people here \n');
            socket.write('Type messages, or type `exit` at any time to leave \n');
        }
        else {
            if ('exit' === message) {
                socket.end();
            }
            else {
                broadcast(name, message);
            }
        }
    });
    socket.on('close', function () {
    });
});
server.on('listening', function () {
    var addr = server.address();
    console.log('server listening on port %d', addr.port);
});
server.listen({
    host: ip.address(),
    port: 3000
});
