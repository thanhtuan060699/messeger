/**
 * 
 * @param io from socket.io lib
 */
 let userOnlineOffline = (io) =>{
    let clients={}
    io.on("connection",(socket)=>{

        //push socket id in array
        let currenUserId=socket.request.user._id
        if(clients[currenUserId]){
            clients[currenUserId].push(socket.id)
        }
        else{
            clients[currenUserId]=[socket.id]
        }

        let listUsersOnline = Object.keys(clients);
     
        //Step 01 :  Emit to user after login or f5 web page
        socket.emit("server-send-list-online", listUsersOnline)

        //Step 02 : Emit to all user when another one online
        socket.broadcast.emit("server-send-when-new-server-online", socket.request.user._id)

        socket.on("disconnect",() => {
            clients[currenUserId]=clients[currenUserId].filter((socketId)=>{
                return socketId !== socket.id
            })
            if(!clients[currenUserId].length){
                delete clients[currenUserId]
            }
            socket.broadcast.emit("server-send-when-new-server-ofline", socket.request.user._id)
        })
        
    })
}

module.exports = userOnlineOffline