/**
 * 
 * @param io from socket.io lib
 */
let removeRequestContact = (io) =>{
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
        socket.on("remove-request-contact",(data)=>{
            let currentUSer={
                id : socket.request.user._id
            }
            //emit notification
            if(clients[data.contactId]){
                clients[data.contactId].forEach(socketId=>{
                    io.sockets.connected[socketId].emit("response-remove-request-contact",currentUSer)
                })
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

module.exports =removeRequestContact