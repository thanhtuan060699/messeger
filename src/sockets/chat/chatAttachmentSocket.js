/**
 * 
 * @param io from socket.io lib
 */
 let chatAttachment = (io) =>{
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
    
       socket.on("chat-attachment",(data)=>{
           //emit notification
           if(clients[data.message.receiverId]){
               clients[data.message.receiverId].forEach(socketId=>{
                   io.sockets.connected[socketId].emit("chat-attachment-response",data)
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

module.exports = chatAttachment