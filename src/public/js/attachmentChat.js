function attachmentChat(divId){
    $(`#attachment-chat-${divId}`).unbind("change").on("change",function(){
        let fileData = $(this).prop("files")[0];
        let limit = 1048576;

        if(fileData.size > limit){
            alertify.notify("Tệp tin đính kèm upload không qua 1 MB", "error", 7);
            $(this).val(null);
            return false;
        }

        let targetId = $(this).data('chat');

        let messageFormData = new FormData();
        messageFormData.append("my-attachment-chat",fileData)
        messageFormData.append("uid", targetId)

        $.ajax({
            url: "/message/add-new-attachment",
            type: "post",
            caches : false,
            contentType : false,
            processData : false,
            data: messageFormData,
            success: function (response) {
                var data=response
                socket.emit("chat-attachment",response)
                let messageOfMe = $(`<div class="bubble me bubble-attachment-file" data-mess-id="${response.message._id}">
               </div>`);
                let attachmentChat = `<a href="data:${data.message.file.contentType};base64,${bufferToBase64(data.message.file.data.data)}"  download="${data.message.file.fileName}">
                                        ${data.message.file.fileName}
                                    </a>`;
                messageOfMe.html(attachmentChat)
                $(`.right`).find(`.chat[data-chat=${response.message.receiverId}]`).append(messageOfMe)
                nineScrollRight(response.message.receiverId)
            }
        });
    })
}

socket.on("chat-attachment-response",function(response){
    let result = response;
    //avatar
    let receiverAvatar=`<img src="/images/users/${result.message.receiver.avatar}" class="avatar-small">`;
    let messageOfYou = $(`<div class="bubble you bubble-attachment-file" data-mess-id="${response.message._id}">
                    ${receiverAvatar}
               </div>`);
    let attachmentChat = `<a href="data:${response.message.file.contentType};base64,${bufferToBase64(response.message.file.data.data)}"  download="${response.message.file.fileName}">
        ${response.message.file.fileName}
    </a>`;
    messageOfYou.html(attachmentChat)          
    $(`.right`).find(`.chat[data-chat=${result.message.senderId}]`).append(messageOfYou);
    nineScrollRight(result.message.senderId);

})