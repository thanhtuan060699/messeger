
function imageChat(divId){
    $(`#image-chat-${divId}`).unbind("change").on("change",function(){
        let fileData = $(this).prop("files")[0];
        let math = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 1048576;

        if($.inArray(fileData.type, math)=== -1){
            alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận png,jpg và jpeg", "error", 7);
            $(this).val(null);
            return false;
        }
        if(fileData.size > limit){
            alertify.notify("Ảnh upload không qua 1 MB", "error", 7);
            $(this).val(null);
            return false;
        }

        let targetId = $(this).data('chat');

        let messageFormData = new FormData();
        messageFormData.append("my-file-chat",fileData)
        messageFormData.append("uid", targetId)

        $.ajax({
            url: "/message/add-new-image",
            type: "post",
            caches : false,
            contentType : false,
            processData : false,
            data: messageFormData,
            success: function (response) {
                socket.emit("chat-image",response)
                let messageOfMe = $(`<div class="bubble me bubble-image-file" data-mess-id="${response.message._id}">
               </div>`);
                let imageChat = `
                <img src="/images/users/${response.message.sender.avatar}" class="avatar-small"/>
                <img src="data:${response.message.file.contentType};base64,${bufferToBase64(response.message.file.data.data)}"
                                    class="show-image-chat">`;
                messageOfMe.html(imageChat)
                $(`.right`).find(`.chat[data-chat=${response.message.receiverId}]`).append(messageOfMe)
                console.log('log sender')
                console.log(response.message.senderId)
                nineScrollRight(response.message.receiverId)
            }
        });
    })
}
socket.on("chat-image-response",function(response){
    let result = response;
    console.log('log hinh anh')
    console.log(result)
    let messageOfYou = $(`<div class="bubble you bubble-image-file" data-mess-id="${response._id}"></div>`);
    let imageChat = `
    <img src="/images/users/${response.receiver.avatar}" class="avatar-small"/>
    <img src="data:${response.file.contentType};base64,${bufferToBase64(response.file.data.data)}"
                        class="show-image-chat">`;
    messageOfYou.html(imageChat);              
    $(`.right`).find(`.chat[data-chat=${result.senderId}]`).append(messageOfYou);
    nineScrollRight(result.senderId);
})