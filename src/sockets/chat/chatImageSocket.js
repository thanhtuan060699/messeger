/**
 * 
 * @param io from socket.io lib
 */
 let chatImage = (io) =>{
     console.log('voooooo')
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
     
        socket.on("chat-image",(data)=>{
            console.log('log data')
            console.log(data)
            //emit notification
            if(clients[data.message.receiverId]){
                clients[data.message.receiverId].forEach(socketId=>{
                    io.sockets.connected[socketId].emit("chat-image-response",data.message)
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

module.exports = chatImage