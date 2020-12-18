let approveRequestContactReceived = (io) =>{
    let clients ={}
    io.on("connection",(socket)=>{
        let currentUserId = socket.request.user._id
        if(clients[currentUserId]){
            clients[currentUserId].push(socket.id)
        }else{
            clients[currentUserId] = [socket.id]
        }
        socket.on("approve-request-contact-received-io",(data)=>{
            let currentUSer={
                id : socket.request.user._id
            }
            //emit notification
            if(clients[data.contactId]){
                clients[data.contactId].forEach(socketId=>{
                    io.sockets.connected[socketId].emit("response-approve-request-contact-received-io",currentUSer)
                })
            }
        })
        socket.on("disconnect",() => {
            clients[currentUserId]=clients[currentUserId].filter((socketId)=>{
                return socketId !== socket.id
            })
            if(!clients[currentUserId].length){
                delete clients[currentUserId]
            }
        })
    })
}
module.exports = approveRequestContactReceived