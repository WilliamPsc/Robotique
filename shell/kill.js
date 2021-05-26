
var ExecShell = require("../shell/exec_shell.js").ExecShell;

class Kill {
	
	callback(s) {
		//console.log("Kill callback = "+s)
		if (s.indexOf(this.cmd) >= 0) {
			console.log("Kill callback = "+s)
			var pos1 = -1
			var pos2 = -1
			for (var i=0 ; i<s.length ; i++) {
				var c = s.substring(i,i+1)
				if ((c >= '0') && (c <= '9')) {
					pos1 = i
					break
				}
			}
			if (pos1 >= 0) {
				for (var i=pos1+1 ; i<s.length ; i++) {
					var c = s.substring(i,i+1)
					if ((c < '0') || (c > '9')) {
						pos2 = i
						break
					}
				}
				
			}
			if ((pos1 >= 0) && (pos2 >= 0)) {
				console.log("pos1 = ",pos1," pos2 = ",pos2)
				var pid = s.substring(pos1,pos2)
				console.log("pid = "+pid)
				new ExecShell("/bin/kill",["-2",pid])
				
			}
		}
	}
	
	constructor(cmd) {
		var exec = new ExecShell("/bin/ps",["-x"])
		this.cmd = cmd
		exec.objCallback = this;
	}
}

//new Exec("/usr/bin/node",["/home/pi/node/websocket/websocket.js"])

//setTimeout(() => {
//	new Kill("/home/pi/node/websocket/websocket.js")
//}, 5000);

module.exports = {
		Kill : Kill
}
