let removeRequestContactReceived = (io) =>{
    let clients = {}
    io.on("connection",(socket) =>{
        //put socket id in array
        let currentUserId = socket.request.user._id
        if(clients[currentUserId]){
            clients[currentUserId].push(socket.id)
        }
        else{
            clients[currentUserId]=[socket.id]
        }
        socket.on("remove-request-contact-received",(data) =>{
            let currentUser ={
                id : socket.request.user._id
            }
            console.log("AAa")
            //emit 
            if(clients[data.contactId]){
                clients[data.contactId].forEach((socketId)=>{
                    io.sockets.connected[socketId].emit("response-remove-request-contact-received",currentUser)
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
module.exports = removeRequestContactReceived