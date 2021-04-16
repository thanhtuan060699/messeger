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
                console.log(response) 
            }
        });
    })
}