
function addContact (){
    $(".user-add-new-contact").bind("click",function(){
        let targetId= $(this).data("uid")
        $.post("/contact/add-new",{uid : targetId},function(data){
            if(data.success){
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display","none")
                $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).css("display","inline-block")
                increaseNumberNofiContact("count-request-contact-sent")
                socket.emit("add-new-contact",{contactId: targetId})
            }
        })
    })
}
socket.on("response-add-new-contact",function (user) {
    let notif=`<div class="notif-readed-failed" data-uid="${user.id}">
        <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
        <strong>${user.username}</strong> đã gửi lời kết bạn cho bạn!
        </div>`
    $(".noti_content").prepend(notif)
    $("ul.list-notifications").prepend(`<li>${notif}</li>`)
    increaseNumberNofiContact("count-request-contact-received")
    increaseNumberNofication("noti_contact_counter")
    increaseNumberNofication("noti_counter")
})