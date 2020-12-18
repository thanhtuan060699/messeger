
function removeRequestContact(){
    $(".user-remove-request-contact").bind("click",function(){
        let targetId= $(this).data("uid")
        $.ajax({
            type: "DELETE",
            url: "contact/remove-request-contact-sent",
            data: {uid:targetId},
            success: function (response) {
                if(response.success){
                    $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).css("display","none")
                    $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display","inline-block")
                    decreaseNumberNofication("noti_contact_counter",1)

                    decreaseNumberNofiContact("count-request-contact-sent")
                    
                    //delete contact in confirm column
                    $("#request-contact-sent").find(`ul li[data-uid = ${targetId}]`).remove()
                    //realtime
                    socket.emit("remove-request-contact-sent",{contactId:targetId})
                }
            }
        });
    })
}
socket.on("response-remove-request-contact-sent",function (user) {
    $(".noti_content").find(`div[data-uid = ${user.id}]`).remove()
    $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove()
    decreaseNumberNofiContact("count-request-contact-received")
    decreaseNumberNofication("noti_contact_counter")
    decreaseNumberNofication("noti_counter")
    //delete request contact
    $("#request-contact-received").find(`ul li[data-uid = ${user.id}]`).remove()
})