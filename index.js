const Bugout=require('bugout');
const WebTorrent = require("webtorrent");
// var Bugout = require("bugout");
const wrtc = require("wrtc");

const wt = new WebTorrent({tracker: {wrtc: wrtc}});

const b = Bugout({wt: wt});

b.on("announce", console.log.bind(console, "Announced:"));
b.on("connections", console.log.bind(console, "Connections:"));
b.on("seen", console.log.bind(console, "Seen:"));
b.on("rpc", console.log.bind(console, "RPC:"));
b.on("message", console.log.bind(console, "Message:"));

// respond to ping calls by sending back "pong"


console.log("Connect to this Bugout instance:\n");
console.log("https://chr15m.github.io/bugout/#" + b.address() + "\n");

console.log("Address:", b.address());
console.log("Seed:", b.seed);
console.log("Announcing to trackers...");
const Net=require('net');
// Start a TCP server on 0.0.0.0:8080
const server=new Net.Server();
server.listen(8080,function(){
    console.log('TCP server listening on port 8080');
});
server.on('connection', function(socket) {
    console.log('A new connection has been established.');

    // Now that a TCP connection has been established, the server can send data to
    // the client by writing to its socket.
    // socket.write('Hello, client.');

    // The server can also receive data from the client by reading from its socket.
    socket.on('data', function(chunk) {
        b.send(chunk.toString());
        // use chunk.toString() to get data
    });

    // When the client requests to end the TCP connection with the server, the server
    // ends the connection.
    socket.on('end', function() {
        console.log('Closing connection with the client');
    });

    // Don't forget to catch error, for your own sake.
    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
    b.register("packet", function(pk, args, cb) {
        socket.write(args.data());
        cb(args);
    }, "Get data from remote");
});
