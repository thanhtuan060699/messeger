
function removeRequestContact(){
    $(".user-remove-request-contact").bind("click",function(){
        let targetId= $(this).data("uid")
        $.ajax({
            type: "DELETE",
            url: "contact/remove-request-contact",
            data: {uid:targetId},
            success: function (response) {
                if(response.success){
                    $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).css("display","none")
                    $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display","inline-block")
                    decreaseNumberNofiContact("count-request-contact-sent")
                    //realtime
                    socket.emit("remove-request-contact",{contactId:targetId})
                }
            }
        });
    })
}
socket.on("response-remove-request-contact",function (user) {
    $(".noti_content").find(`div[data-uid = ${user.id}]`).remove()
    $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove()
    decreaseNumberNofiContact("count-request-contact-received")
    decreaseNumberNofication("noti_contact_counter")
    decreaseNumberNofication("noti_counter")
})