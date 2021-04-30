function typingOn(divId){
    let targetId = $(`#write-chat-${divId}`).data("chat");
    socket.emit("user-is-typing",targetId)
}