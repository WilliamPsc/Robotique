
var serveur = "vps811407.ovh.net"

var port_web = 3161
var port_websocket = 4161

var url_serveur_web = "http://" + serveur + ":" + port_web
var url_serveur_websocket = "ws://" + serveur + ":" + port_websocket

var rep_html = "/home/u161/robot_m1/serveur_web/ihm"

var shell_serveur_websocket = 
    "/usr/bin/node /home/u161/robot_m1/websocket/serveur_websocket.js"

var shell_client_websocket_robot = 
    "/usr/bin/node /home/u161/robot_m1/websocket/client_websocket_robot.js"

var timeout_web_ihm = 10000      // ms
var timeout_web_robot = 10000    // ms

var debug_serveur_web = true
var debug_serveur_websocket = true
var debug_robot = true

module.exports = {
    port_web : port_web,
    port_websocket : port_websocket,

    url_serveur_web : url_serveur_web,
    url_serveur_websocket : url_serveur_websocket,

    rep_html : rep_html,

    shell_client_websocket_robot : shell_client_websocket_robot,
    shell_serveur_websocket : shell_serveur_websocket,

    timeout_web_ihm : timeout_web_ihm,
    timeout_web_robot : timeout_web_robot,

    debug_serveur_web : debug_serveur_web,
    debug_serveur_websocket : debug_serveur_websocket,
    debug_robot : debug_robot,
}

