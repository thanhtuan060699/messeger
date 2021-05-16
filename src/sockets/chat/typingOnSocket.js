/**
 * 
 * @param io from socket.io lib
 */
 let typingOn = (io) =>{
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
     
        socket.on("user-is-typing",(data)=>{
            
            //emit notification
            if(data.contactId){
                if(clients[data.contactId]){
                    clients[data.contactId].forEach(socketId=>{
                        io.sockets.connected[socketId].emit("response-user-is-typing",{currentUserId : socket.request.user._id})
                    })
                }
            }
            
           
        })
        socket.on("disconnect",() => {
            clients[currenUserId]=clients[currenUserId].filter((socketId)=>{
                return socketId !== socket.id
            })
            if(!clients[currenUserId].length){
                delete clients[currenUserId]
            }
        })
        
    })
}

module.exports = typingOn