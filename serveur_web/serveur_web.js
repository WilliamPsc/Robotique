var config = require('../config/config.js')
var port_web = config.port_web
var url_serveur_web = config.url_serveur_web
var rep_html = config.rep_html
var shell_client_websocket_robot = config.shell_client_websocket_robot
var shell_serveur_websocket = config.shell_serveur_websocket
var debug = config.debug_serveur_web

var axios = require('axios')

var ExecShell = require("../shell/exec_shell.js").ExecShell
var Kill = require("../shell/kill.js").Kill
var Ps = require("../shell/ps.js").Ps

var message = require("../message/message.js").message

const { exec } = require('child_process');

// var ServeurWebSocket = require("../websocket/serveur_websocket.js").ServeurWebSocket
// var ws = new ServeurWebSocket(port_websocket)

var express = require('express');
var bodyParser = require('body-parser');


var lmess = []

var app = express();
app.use(bodyParser.json()); // on veut pouvoir passer en paramètre des objets json
app.use(bodyParser.urlencoded({extended: true}) ); // true si objets complexes

app.use('/ihm', express.static(rep_html,{index:'index.html'}));

app.post('/web_message', function (req, res) {
    var mess = JSON.parse(req.body.mess)
    if (mess.cmd == "check") {
        if (debug) console.log("check "+mess.srce)
        var lres = [];
        var lmess2 = [];
        for (var i=0 ; i<lmess.length ; i++) {
            if (lmess[i].dest == mess.srce) {
                lres.push(lmess[i]);
            }
            else {
                lmess2.push(lmess[i]);
            }
        }
        lmess = lmess2;
        res.send(lres)
        return
    }
    else if (mess.cmd == "serveur-websocket-on") {
        if (debug) console.log("serveur-websocket-on")
        exec(shell_serveur_websocket + "&")
        setTimeout(() => {
            new Ps(shell_serveur_websocket,{callback : function (data) {
                if (debug) console.log("PS : ",data)
                var arg = {id : "serveur-websocket-info" , val : data }
                axios.post(url_serveur_web+'/web_message',
                    {mess : JSON.stringify(
                        message("vps", "ihm","info",arg))})
            }})
        }, 2000);
    }
    else if (mess.cmd == "serveur-websocket-off") {
        console.log("serveur-websocket-off")
        new Kill(shell_serveur_websocket)
        setTimeout(() => {
            new Ps(shell_serveur_websocket,{callback : function (data) {
                console.log("PS : ",data)
                var arg = {id : "serveur-websocket-info" , val : data }
                axios.post(url_serveur_web+'/web_message',
                    {mess : JSON.stringify(
                        message("vps","ihm","info",arg))})
            }})
        }, 2000);
    }
    else if (mess.cmd == "serveur-websocket-info") {
        console.log("serveur-websocket-info")
        new Ps(shell_serveur_websocket,{callback : function (data) {
            console.log("PS : ",data)
            var arg = {id : "serveur-websocket-info" , val : data }
            axios.post(url_serveur_web+'/web_message',
                {mess : JSON.stringify(
                    message("vps","ihm","info",arg))})
        }})				
    }
    else {
        if (debug) console.log("push "+mess.srce+" "+mess.cmd)
        lmess.push(mess)
    }
    if (debug) console.log("serveur : "+JSON.stringify(mess))
})

var server = app.listen(port_web, function() {
    if (debug) console.log('Express server listening on port ' + port_web)
});

