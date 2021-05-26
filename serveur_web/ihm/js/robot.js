var check_info = "ON"
var count_check = 0

var timeout = 10000
var angleR = 0
var distanceR = 0
var distanceA = 0

var ws = null	// client websocket
var adr_ws = "ws://vps811407.ovh.net:4161"

$(document).ready(function () {
	set_check("ON")
	check()
	web_message("serveur-websocket-info")
	web_message("client-websocket-robot-info")
});

function message(srce,dest,cmd,arg) {
    if(typeof arg === 'undefined') arg = ""
 	var bloc = {
			srce : srce,
			dest : dest,
			cmd : cmd,
			arg : arg,
			time : new Date().getTime()
		}
	return bloc;
}

function set_check(val) {
	if (val == "ON") {
		if (check_info != "ON") {
			check_info = "ON"
			check()
		}
	}
	else if (val == "") {
	}
	else {
		check_info = "OFF"
	}
	$("#check-info").html(check_info)
}

function check() {
	console.log("check")
	if (check_info == "ON") {
		$.ajax({
				url : "../web_message",
				method : "post",
				data : {
					mess : JSON.stringify(message("ihm","","check"))
				},
				dataType : "json",
				success : function (data) {
					count_check++
					$("#check-count").html(""+count_check)
					data.forEach((item) => {
						console.log("item = "+JSON.stringify(item))
						if (typeof item.cmd !== "undefined") {
							if (item.cmd == "info") {
								console.log("info id = "+item.arg.id)
								if (typeof item.arg.id !== "undefined") {
									console.log("item.arg.id = ",item.arg.id)
									$("#"+item.arg.id).html(item.arg.val)
								}
							}
						}
					})
					setTimeout(() => {
						check();
					}, timeout);
				},
				error : function (data) {
					if (typeof data.id !== "undefined") {
						console.log("data.id = ",data.id)
						$("#"+data.id).html(data.val)
					}
		
					setTimeout(() => {
						check();
					}, timeout);
				}
			})
		}
		else {
			setTimeout(() => {
					check();
			}, timeout);		
		}
}

function web_message(cmd,arg) {
    if(typeof arg === 'undefined') arg = ""
	$.ajax({
		url : "../web_message",
		method : "post",
		data : {
			mess : JSON.stringify(message("ihm","robot",cmd,arg))
		},
		dataType : "json",
		success : function (data) {
			console.log(JSON.stringify(data))
			//if (typeof data.id !== "undefined") {
			//	console.log("data.id = ",data.id)
			//	$("#"+data.id).html(data.val)
			//}
		},
		error : function (data) {
		}
	})
}


function ws_open() {
	if (ws != null) return

	ws = new WebSocket(adr_ws);

	ws.addEventListener('open', () => {
		  // Send a message to the WebSocket server
		  ws.send("Le websocket s'est bien ouvert côté client");
		});
		
	ws.addEventListener('message', event => {
		  console.log('Received:', event.data);
		  if (event.data.indexOf("{") >= 0) {
			try {
				var o = JSON.parse(event.data)
				if (o.dest == "ihm") {
					$("#robot-info").html(o.arg.mess+" ("+((new Date().getTime()) - o.time)+" ms)")
					$('#robot').html(o.arg.robot)
					$('#angle').html(o.arg.angle)
					$('#distance').html(o.arg.dist)
					$('#batterie').html(o.arg.bat)
					go()
					avancer()
					arretObstacle()
					angleR = o.arg.angle
					distanceR = o.arg.dist
				}
			}
			catch (e) {}
		}

			// if (typeof event.data.id !== "undefined") {
			// 	console.log("data.id = ",data.id)
			// 	$("#"+data.id).html(data.val)
			// }

		});

}

function ws_send(cmd,arg) {
    if(typeof arg === 'undefined') arg = ""
	ws.send(JSON.stringify(message("ihm","robot",cmd,arg)))
}

function check_ws() {
	ws_send("nop");
	setTimeout(() => {
		check_ws()
	}, 1000);
}

// consignes

var exec_go = 0
// 0 : go ne s'exécute plus ; 1 : go peut s'exécuter

var angle_dest = null
// si angle est non nul, angle contient la direction dans laquelle on veut placer le robot

// La fonction go décide quelle commande exécuter
// en fonction des consignes

function go() {
	if (exec_go == 0) {
		// le robot a atteint sa destination

		// on annule les consignes
		angle_dest = null

		// pour continuer d'afficher les valeurs des capteurs 
		// après l'arrêt du robot il faut renvoyer un nop
		/*setTimeout(() => {
			ws_send("nop")	
		}, 1000);*/
		
		return
	}

	try {
		var angle = parseInt($("#angle").html())
		console.log("angle = "+angle)
		if (angle_dest != null) {
			if ((angle > angle_dest - 20) && (angle < angle_dest + 5)) {
				// on a atteint la destination
                // on arrête le robot
                // bug : ne marche pas si angle_dest voisin de 0
				exec_go = 0
				ws_send("nop")	
			}
			else {
				setTimeout(() => {
					ws_send("droite")	
				}, 200);
			}
		}
	}
	catch (e) {
		// on tente de relancer go en envoyant un nop
		setTimeout(() => {
			ws_send("nop")	
		}, 1000);
	}
}

var dist_dest = null
var exec_avancer = 0
var nbTour = 0
function avancer() {
	if (exec_avancer == 0) {
		// le robot a atteint sa destination

		// on annule les consignes
		dist_dest = null

		// pour continuer d'afficher les valeurs des capteurs 
		// après l'arrêt du robot il faut renvoyer un nop
		
		return
	}

	try {
		var distance = parseInt($("#distance").html())
		console.log("Distance : " + distance)
		if (dist_dest != null && nbTour != 0) {
			if (distance < dist_dest + 10 && nbTour <= 0) {
				// on a atteint la destinatio
                // on arrête le robot
                // bug : ne marche pas si angle_dest voisin de 0
				exec_avancer = 0
				nbTour = 0
				ws_send("nop");
			}
			else {
				setTimeout(() => {	
					ws_send("avant");
					console.log("nbTour : " + nbTour)
					nbTour = nbTour - 1;
				}, 500);
			}
		}
	}
	catch (e) {
		// on tente de relancer go en envoyant un nop
		console.log("catch avance ici " );
		setTimeout(() => {
			ws_send("nop")	
		}, 200);
	}
}



function distVoulu(dist) {
	var distance = parseInt($("#distance").html())	// on récupère la distance avec l'obstacle
	dist_dest = distance - dist 					// on calcul la distance final avec l'obstacle
	if(dist_dest < 0 ) return
	console.log("distance attendue : " + dist_dest);
	nbTour = Math.floor(dist / 25)
	exec_avancer = 1	
}



function dirAngle(degre) {
	console.log("Angle voulu : " + (degre+10));
	angle_dest = degre // on veut orienter le robot plein est (90°)
	exec_go = 1 // on laisse go s'exécuter
}



function stop() {
	exec_go = 0
	exec_avancer = 0
	exec_tour = 0
	exec_arretObstacle = 0
}

var exec_arretObstacle = 0 
var nbTourObst = 0
function arretObstacle() {
	if (exec_arretObstacle == 0 ) {
		// le robot a atteint sa destination

		// on annule les consignes
		dist_dest = null

		// pour continuer d'afficher les valeurs des capteurs 
		// après l'arrêt du robot il faut renvoyer un nop
		/*setTimeout(() => {
			ws_send("nop")	
		}, 1000);*/
		
		return
	}

	try {
		var distance = parseInt($("#distance").html())
		console.log("distance obstacle = "+distance)
		if (distance < 60 && nbTourObst <= 0) {
			// on a atteint la destinatio
            // on arrête le robot
            // bug : ne marche pas si angle_dest voisin de 0
            if (distance > 40){
            	nbTourObst = 1
            } else {
				exec_arretObstacle = 0
		    }
		}
		else {
				if (nbTourObst > 0) {
					setTimeout(() => {
						ws_send("avant")
				
					}, 500);
					nbTourObst = nbTourObst - 1;
					console.log("nbTour: " + nbTourO);
				}
		}
	}
	catch (e) {
		// on tente de relancer go en envoyant un nop
		console.log("catch avance ici " );
		setTimeout(() => {
			ws_send("nop")	
		}, 1000);
	}

}

function obstacle() {
	var distance = parseInt($("#distance").html())
	if (distance > 50) {
		nbTourObst = Math.floor((distance - 40)/ 25)
		exec_arretObstacle = 1 // on laisse go s'exécuter
	}
}



function tourSalle() {
	arretObstacle()
	var angle = parseInt($("#angle").html())
	dirAngle(angle+90)
	arretObstacle()
	angle = parseInt($("#angle").html())
	dirAngle(angle+90)
	arretObstacle()
	angle = parseInt($("#angle").html())
	dirAngle(angle+90)
	arretObstacle()
	angle = parseInt($("#angle").html())
	dirAngle(angle+90)
}