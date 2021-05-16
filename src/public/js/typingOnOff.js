function typingOn(divId){
    let targetId = $(`#write-chat-${divId}`).data("chat");
    socket.emit("user-is-typing",{contactId : targetId})
}
$(document).ready(function(){
    socket.on("response-user-is-typing",function(response){
        let messageTyping = `<div class="bubble you bubble-typing-gif"> 
            <img src="/images/chat/typing.gif" />
        </div>`;
        $(`.chat[data-chat=${response.currentUserId}]`).append(messageTyping)
        nineScrollRight(response.currentUserId);
    })
    
})