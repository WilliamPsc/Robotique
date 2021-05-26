
var spawn = require('child_process').spawn;     // pour le lancement des processus par spawn
//const { exec } = require('child_process');     // pour le lancement des processus par exec

class Ps {
	
	callback(s) {
		if (this.objCallback == null) {
			console.log("callback exec = "+s)			
		}
		else {
			this.objCallback.callback(s)
		}
	}

	constructor(cmd,objCallback) {
		this.chunk = ""
		this.objCallback = objCallback
		
		console.log("Ps "+cmd)
		
		var exec = this;

		var proc = spawn("/bin/ps",["-x"],{detached : true});

		setTimeout(() => {
			var res = "OFF"
			// console.log("chunk = "+exec.chunk)
			if (exec.chunk.indexOf(cmd) >= 0) {
				res = "ON"
			}
			exec.objCallback.callback(res)
		}, 1000);
		
		proc.stdout.on( 'data', data => {
		    //console.log("data = ",data.toString());
			exec.chunk += data;

		});

		proc.stderr.on( 'data', data => {
		    //console.log(data.toString());
		});

	}
	
	exec() {
		
	}
}


module.exports = {
		Ps : Ps
}


//new Exec("/bin/ls",["-l","/usr/bin"])
//new Exec("/usr/bin/node",["/home/pi/node/websocket/websocket.js"])
