var config = require('../config/config.js')
var url_serveur_web = config.url_serveur_web
var shell_client_websocket_robot = config.shell_client_websocket_robot
var timeout = config.timeout_web_robot
var debug = config.debug_robot


var axios = require('axios')

var ExecShell = require("../shell/exec_shell.js").ExecShell
var Kill = require("../shell/kill.js").Kill
var Ps = require("../shell/ps.js").Ps

var message = require("../message/message.js").message

const { exec } = require('child_process');


setTimeout(() => {
    //usb_USB0.port.write("right_255\n")
    check();
}, timeout);


function check() {
    
    var moi = this;

	//if (debug) console.log("check")
	
	// on interroge le serveur
    axios.post(url_serveur_web+'/web_message',
        {mess : JSON.stringify(
            message("robot","vps","check"))})
	.then((res) => {
        if (debug) console.log("check : "+JSON.stringify(res.data))
        try {
            for (var i=0 ; i<res.data.length ; i++) {
                var mess = res.data[i];
                if (mess.cmd == "client-websocket-robot-on") {
                    if (debug) console.log("client-websocket-robot-on")
                    exec(shell_client_websocket_robot + "&")
					setTimeout(() => {
						new Ps(shell_client_websocket_robot,{callback : function (data) {
							if (debug) console.log("PS : ",data)
							var arg = {id : "client-websocket-robot-info" , val : data }
                            axios.post(url_serveur_web+'/web_message',
                                {mess : JSON.stringify(
                                    message("robot", "ihm","info",arg))})
						}})
					}, 2000);
                }
                else if (mess.cmd == "client-websocket-robot-off") {
					console.log("client-websocket-robot-off")
					new Kill(shell_client_websocket_robot)
					setTimeout(() => {
						new Ps(shell_client_websocket_robot,{callback : function (data) {
							console.log("PS : ",data)
							var arg = {id : "client-websocket-robot-info" , val : data }
                            axios.post(url_serveur_web+'/web_message',
                                {mess : JSON.stringify(
                                    message("robot","ihm","info",arg))})
						}})
					}, 2000);
                }
                else if (mess.cmd == "client-websocket-robot-info") {
					console.log("client-websocket-robot-info")
					new Ps(shell_client_websocket_robot,{callback : function (data) {
						console.log("PS : ",data)
						var arg = {id : "client-websocket-robot-info" , val : data }
                        axios.post(url_serveur_web+'/web_message',
                            {mess : JSON.stringify(
                                message("robot","ihm","info",arg))})
					}})				
                }

            }
        }
        catch (e) {}
        setTimeout(() => {
            check();
        }, timeout);

    })
    .catch(function (erreur) {
	    //On traite ici les erreurs éventuellement survenues
	    //if (debug) console.log("erreur check ")
	    //if (debug) console.log(erreur);
	    setTimeout(() => {
			check();
		}, timeout);
	});

}
