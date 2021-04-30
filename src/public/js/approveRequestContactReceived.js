function approveRequestContactReceived(){
    $(".user-appprove-request-contact-received").bind("click",function(){
        let targetId = $(this).data("uid")
        $.ajax({
            type: "put",
            url: "/contact/approve-request-contact-received",
            data: {uid : targetId},
            success: function (response) {
                //remove request contact received
                $("#request-contact-received").find(`li[data-uid =${response.userContactModel.id}]`).remove()

                //add to list of contact
                let listContact= `<li class="_contactList" data-uid="${response.userContactModel.id}">
                                    <div class="contactPanel">
                                    <div class="user-avatar">
                                         <img src="images/users/${response.userContactModel.avatar}" alt="">
                                    </div>
                                    <div class="user-name">
                                         <p>
                                         ${response.userContactModel.username}
                                         </p>
                                    </div>
                                    <br>
                                    <div class="user-address">
                                         <span>&nbsp; ${response.userContactModel.address} .</span>
                                    </div>
                                    <div class="user-talk" data-uid="${response.userContactModel.id}">
                                        Trò chuyện
                                    </div>
                                    <div class="user-remove-contact action-danger" data-uid="${response.userContactModel.id}">
                                        Xóa liên hệ
                                    </div>
                                   </div>
                                 </li>`
                $("#contacts").find("ul").prepend(listContact)
                socket.emit("approve-request-contact-received-io",{contactId : targetId})
            }
        });
    })
}

socket.on("response-approve-request-contact-received-io",function(user){
    $("#request-contact-sent").find(`li[data-uid = ${user.id}]`).remove()
    

})

$(document).ready(function(){
    approveRequestContactReceived()
})