/**
 * 
 * @param io from socket.io lib
 */
let addNewContact = (io) =>{
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

        socket.on("add-new-contact",(data)=>{
            let currentUSer={
                id : socket.request.user._id,
                username : socket.request.user.username,
                avatar : socket.request.user.avatar,
                address : (socket.request.user.address !== null)?socket.request.user.address : ""
            }
            //emit notification
            if(clients[data.contactId]){
                clients[data.contactId].forEach(socketId=>{
                    io.sockets.connected[socketId].emit("response-add-new-contact",currentUSer)
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

module.exports =addNewContact