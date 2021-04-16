const { request } = require("express")

/**
 * 
 * @param io from socket.io lib
 */
 let chatVideo = (io) =>{
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
     
        socket.on("caller-check-listener-onl-or-not",(data)=>{
            if(clients[data.listenId]){
                //online
                let response = {
                    callerId : socket.request.user._id,
                    listenId : data.listenId,
                    callerName : data.callerName
                }
                clients[data.listenId].forEach(socketId=>{
                    io.sockets.connected[socketId].emit("server-request-peer-id-of-listener",response)
                })
            }else{
                //ofline
                socket.emit("server-send-listener-offline")
            }
           
        });

        socket.on("listener-emit-peer-id-to-server",(data)=>{
            console.log('log day 2' , data)
            let response = {
                callerId : data.callerId,
                listenId : data.listenId,
                callerName : data.callerName,
                listenerName : data.listenerName,
                listenerPeerId : data.listenerPeerId
            }
            clients[data.callerId].forEach(socketId=>{
                io.sockets.connected[socketId].emit("server-send-peer-of-listener-to-caller",response)
            })
           
        })

        //get request call from caller

        socket.on("caller-request-call-to-server", (data)=>{
            console.log('log o day', data)
            let response = {
                callerId : data.callerId,
                listenId : data.listenId,
                callerName : data.callerName,
                listenerName : data.listenerName,
                listenerPeerId : data.listenerPeerId
            }
            clients[data.listenId].forEach(socketId=>{
                io.sockets.connected[socketId].emit("server-send-request-call-to-listener",response)
            })
        })

        //get request cancel call from caller
        socket.on("caller-cancel-request-call-to-server", (data)=>{
            let response = {
                callerId : data.callerId,
                listenId : data.listenId,
                callerName : data.callerName,
                listenerName : data.listenerName,
                listenerPeerId : data.listenerPeerId
            }
            clients[data.listenId].forEach(socketId=>{
                io.sockets.connected[socketId].emit("server-send-request-cancel-call-to-listener",response)
            })
        });

        socket.on("listener-reject-request-call-to-server", (data=>{
            let response = {
                callerId : data.callerId,
                listenId : data.listenId,
                callerName : data.callerName,
                listenerName : data.listenerName,
                listenerPeerId : data.listenerPeerId
            }
            clients[data.callerId].forEach(socketId=>{
                io.sockets.connected[socketId].emit("server-send-reject-call-to-caller-from-listener",response)
            })
        }));

        socket.on("listener-accept-request-call-to-server", (data=>{
            console.log('thhhhh')
            console.log(data)
            let response = {
                callerId : data.callerId,
                listenId : data.listenId,
                callerName : data.callerName,
                listenerName : data.listenerName,
                listenerPeerId : data.listenerPeerId
            }
            console.log(response)
            clients[data.callerId].forEach(socketId=>{
                io.sockets.connected[socketId].emit("server-send-accept-call-to-caller",response)
            })
            clients[data.listenId].forEach(socketId=>{
                io.sockets.connected[socketId].emit("server-send-accept-call-to-listener",response)
            })
        }));

        socket.on("disconnect",() => {
            clients[currenUserId]=clients[currenUserId].filter((socketId)=>{
                return socketId !== socket.id
            })
            if(!clients[currenUserId].length){
                delete clients[currenUserId]
            }
        });
        
    })
}

module.exports = chatVideo