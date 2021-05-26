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

module.exports = {
    message : message
}
