
var spawn = require('child_process').spawn;     // pour le lancement des processus par spawn
//const { exec } = require('child_process');     // pour le lancement des processus par exec

class ExecShell {
	
	callback(s) {
		if (this.objCallback == null) {
			console.log("callback exec = "+s)			
		}
		else {
			this.objCallback.callback(s)
		}
	}

	constructor(cmd,args,objCallback) {
		this.chunk = ""
		this.objCallback = objCallback
		
		console.log("Exec cmd = "+cmd+" args = "+JSON.stringify(args))
		
		var exec = this;

		var proc = spawn(cmd,args,{detached : true});

		proc.stdout.on( 'data', data => {
		    //console.log(data.toString());
			exec.chunk += data;
			for (;;) {
				var pos = exec.chunk.indexOf("\n");
				if (pos < 0) break;
				var res = exec.chunk.substring(0,pos)
				//console.log("res = "+res)
				exec.chunk = exec.chunk.substring(pos+1);
				this.callback(res)


				//console.log(port.data.substring(0,pos));
			}

		});

		proc.stderr.on( 'data', data => {
		    //console.log(data.toString());
		});

	}
	
	exec() {
		
	}
}


module.exports = {
		ExecShell : ExecShell
}


//new Exec("/bin/ls",["-l","/usr/bin"])
//new Exec("/usr/bin/node",["/home/pi/node/websocket/websocket.js"])
