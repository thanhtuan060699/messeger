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
            console.log(dataTextEmojiForSend)
            $.post("/message/add-new-text-emoji",dataTextEmojiForSend,function(result){
                console.log(result.message)
                let messageOfMe = $(`<div class="bubble me" data-mess-id="${result.message.senderId}"> </div>`)
                messageOfMe.html(`<img src="/images/users/${result.message.sender.avatar}" class="avatar-small">`)
                messageOfMe.text(result.message.text)                        
                $(`.right`).find(`.chat[data-chat=${divId}]`).append(messageOfMe)
                nineScrollRight(divId)
                $(`#write-chat-${divId}`).val("")
                currentEmojioneArea.find(".emojionearea-editor").text("")
            })
        }
        
    })
}