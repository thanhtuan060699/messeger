
function removeRequestContactReceived(){
    $(".user-reject-request-contact-received").bind("click",function(){
        let targetId= $(this).data("uid")
        $.ajax({
            type: "DELETE",
            url: "contact/remove-request-contact-received",
            data: {uid:targetId},
            success: function (response) {
                $("#request-contact-received").find(`ul li[data-uid = ${targetId}]`).remove()
                if(response.success){
                    $("#request-contact-received").find(`ul li[data-uid = ${targetId}]`).remove()

                    decreaseNumberNofication("noti_contact_counter")
                    
                    decreaseNumberNofiContact("count-request-contact-received")
                    //delete request contact
                   

                    //realtime
                    socket.emit("remove-request-contact-received",{contactId:targetId})
                }
            },
            error :function (response) {
            }
        });
    })
}
socket.on("response-remove-request-contact-received",function (user) {
    $("#find-user").find(`div.user-remove-request-contact[data-uid = ${user.id}]`).css("display","none")
    $("#find-user").find(`div.user-add-new-contact[data-uid = ${user.id}]`).css("display","inline-block")

    //delete contact in confirm column
    $("#request-contact-sent").find(`ul li[data-uid = ${user.id}]`).remove()
    
    decreaseNumberNofiContact("count-request-contact-sent")
    decreaseNumberNofication("noti_contact_counter",1)
    
})
$(document).ready(function(){
    removeRequestContactReceived()
})

