
// ce client websocket simule un robot en fonctionnement

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// avant de tester ce programme il faut modifier la ligne
// var adr = "ws://localhost:4xxx"
// et remplacer 4xxx par un numéro de port websocket
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// initialement le robot est orienté
// suivant un angle de 15° par rapport au nord (variable angle)
// et il y a un obstacle en face de lui à 700 cm (variable dist)

// quand on envoie les messages "avant" ou "arriere"
// la variable "dist" est décrémentée ou incrémentée de 30 cm

// quand on envoie les messages "droite" ou "gauche"
// la variable "angle" est incrémentée ou décrémentée de 10°

// après réception d'une commande,
// les valeurs de "dist" et "angle" sont renvoyées sur le websocket

var config = require('../config/config.js')
var url_serveur_websocket = config.url_serveur_websocket
var debug = true

var message = require("../message/message.js").message

// code ES6

var WS = require('ws')


// !!!!!!!!!!! 4xxx numéro de port à modifier !!!!!!!!!!!!!!!!
//var adr = "ws://localhost:4xxx"
var adr = "ws://vps811407.ovh.net:4161"

var xbee = null

var dist = 700
var angle = 15

class ClientWebSocket {
	
	constructor(adr) {
		console.log("Websocket open "+url_serveur_websocket)
		const ws = new WS(url_serveur_websocket);
		//const ws = new WebSocket('ws://vps662945.ovh.net:9100');
		
		console.log("Websocket ok")
		 
		ws.on('open', function open() {
		  	ws.send('Websocket client ok');
		});
		 
		ws.on('message', function incoming(data) {
		  console.log('from server : ',data);
		  //ws.send('client websocket robot : ',data)
		  if (data.indexOf("{") >= 0) {
			  try {
				  var o = JSON.parse(data)
				  if (o.dest == "robot") {
					console.log("cmd = "+o.cmd)
					var mess = message("robot","ihm","info",
						{mess : "robot exec : "+o.cmd,
						angle : angle,
						dist : dist,
						})
					mess.time = o.time
					ws.send(JSON.stringify(mess))
					if (o.cmd == "avant") {
						dist -= 30
					}
					else if (o.cmd == "arriere") {
						dist += 30
					}
					else if (o.cmd == "droite") {
						angle += 10
					}
					else if (o.cmd == "gauche") {
						angle -= 10
					}
					if (angle > 359) {
						angle = angle - 360
					}  else {
						if (angle < 0)  {
							angle = angle  + 360
						}
					}
					//   if (o.cmd == "forward") {
					// 	console.log("forward")
					// 	usb_motors.port.write("timeout_1000\nright_200\nleft_200\n")
					//   }
					//   else if (o.cmd == "backward") {
					// 	console.log("backward")
					// 	usb_motors.port.write("timeout_1000\nright_-200\nleft_-200\n")
					//   }
					//   else if (o.cmd == "right") {
					// 	console.log("right")
					// 	usb_motors.port.write("timeout_200\nright_-200\nleft_200\n")
					//   }
					//   else if (o.cmd == "left") {
					// 	console.log("left")
					// 	usb_motors.port.write("timeout_200\nright_200\nleft_-200\n")
					//   }
				  }

			  }
			  catch (e) {}
		  }
		});

	}
}

// var usb_ACM0 = new USB("/dev/ttyACM0",{callback : 
// 	function (s) {
// 		console.log("ACM0 : "+s)
// 		if (s.indexOf("Motors OK") >= 0) {
// 			usb_motors = usb_ACM0
// 			//usb_ACM1.port.close()
// 			//initXBEE("/dev/ttyACM1")
// 			//initRPLIDAR()
// 			setTimeout(() => {
// 				new ClientWebSocket(adr)
// 			}, 2000);
			
// 		}
// 	}
// })

new ClientWebSocket(adr)

// module.exports = {
// 		ClientWebSocket : ClientWebSocket
// }


