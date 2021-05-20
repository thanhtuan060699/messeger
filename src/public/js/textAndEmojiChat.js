function textAndEmojiChat(divId){
    $(".emojionearea").unbind("keyup").on("keyup",function(element){
        let currentEmojioneArea = $(this)
        if(element.which==13){
            let targetId = $(`#write-chat-${divId}`).data("chat")
            let messageVal = $(`#write-chat-${divId}`).val()
            if(!targetId.length|| !messageVal.length){
                return false
            }
            let dataTextEmojiForSend = {
                targetId : targetId,
                messageVal : messageVal
            }
            $.post("/message/add-new-text-emoji",dataTextEmojiForSend,function(result){
                let dataToEmit = {
                    message : result.message
                }
                
                let senderAvatar=`<img src="/images/users/${result.message.sender.avatar}" class="avatar-small">${result.message.text}`;
                let messageOfMe = $(`<div class="bubble me" data-mess-id="${result.message.senderId}"> ${senderAvatar} </div>`)
                messageOfMe.html(senderAvatar)                        
                $(`.right`).find(`.chat[data-chat=${divId}]`).append(messageOfMe)
                nineScrollRight(divId)
                $(`#write-chat-${divId}`).val("")
                currentEmojioneArea.find(".emojionearea-editor").text("")
                //real time
                socket.emit("chat-text-emoji", dataToEmit)
            })
        }
    })
}
socket.on("chat-text-emoji-response",function (result) {
    let senderAvatar=`<img src="/images/users/${result.sender.avatar}" class="avatar-small">${result.text}`;
    let messageOfFriend = $(`<div class="bubble you" data-mess-id="${result.senderId}"> ${senderAvatar} </div>`);
    messageOfFriend.html(senderAvatar);                        
    $(`.right`).find(`.chat[data-chat=${result.senderId}]`).append(messageOfFriend)
    nineScrollRight(result.senderId)
    $(`#write-chat-${result.senderId}`).val("")
    
})