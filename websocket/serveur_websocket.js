var config = require('../config/config.js')
var port = config.port_websocket

// code ES6

var WS = require('ws')

//console.log("WS args = "+JSON.stringify(process.argv))
//var port = process.argv[2]
//var port = 4000

//console.log("ServeurWebSocket port = "+port)
	

class ServeurWebSocket {
	
	constructor(port) {
		this.clients = [];
		var wss = new WS.Server({ port: port })
		console.log("Websocket server listening on port "+port);

		wss.on('connection', ws => {
			this.clients.push(ws);
			console.log("WS connection OK");
			
			ws.on('message', message => {
				console.log(`Received message => ${message}`);
				this.clients.forEach((c) => {
					c.send(message)
				})
				//ws.send("Le serveur a reçu : "+message);
			});
		});

	}
}

new ServeurWebSocket(port)

module.exports = {
		ServeurWebSocket : ServeurWebSocket
}
