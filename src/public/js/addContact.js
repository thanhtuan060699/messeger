
function addContact (){
    $(".user-add-new-contact").bind("click",function(){
        let targetId= $(this).data("uid")
        $.post("/contact/add-new",{uid : targetId},function(data){
            if(data.success){
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display","none")
                $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).css("display","inline-block")
                increaseNumberNofiContact("count-request-contact-sent")
                let userInfoHtml = $("#find-user").find(`ul li[data-uid = ${targetId}]`).get(0).outerHTML
                $("#request-contact-sent").find("ul").prepend(userInfoHtml)
                removeRequestContact()
                socket.emit("add-new-contact",{contactId: targetId})

            }
        })
    })
}
socket.on("response-add-new-contact",function (user) {
    let notif=`<div class="notif-readed-failed" data-uid="${user.id}">
        <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
        <strong class="user-name-notification">${user.username}</strong>
        <div class="notification-content">Đã gửi lời kết bạn cho bạn!</div>
        </div>`
    $(".noti_content").prepend(notif)
    $("ul.list-notifications").prepend(`<li>${notif}</li>`)
    increaseNumberNofiContact("count-request-contact-received")
    increaseNumberNofication("noti_contact_counter",1)
    increaseNumberNofication("noti_counter",1)
    let userInfoHtml = ` <li class="_contactList" data-uid="${user.id}">
                         <div class="contactPanel">
                         <div class="user-avatar">
                                  <img src="images/users/${user.avatar}" alt="">
                         </div>
                         <div class="user-name">
                             <p>
                                 ${user.username}
                             </p>
                         </div>
                            <br>
                         <div class="user-address">
                               <span>&nbsp ${user.address}.</span>
                         </div>
                         <div class="user-appprove-request-contact-received" data-uid="${user.id}">
                               Chấp nhận
                         </div>
                         <div class="user-reject-request-contact-received action-danger" data-uid="${user.id}">
                               Xóa yêu cầu
                         </div>
                         </div>
                    </li>`
                    
                    $("#request-contact-received").find("ul").prepend(userInfoHtml)
                    removeRequestContactReceived()
})