
function removeContact(){
    $('.user-remove-contact').unbind("click").on("click",function(){
        let targetId = $(this).data("uid");
        let username = $(this).parent().find("div.user-name p").text()
        Swal.fire({
            title : `Bạn có chắc chắn muốn xóa ${username} ra khỏi danh bạ hay không ?`,
            type : "warning",
            showCancelButton : true,
            confirmButtonColor : "#2ECC71",
            cancelButtonColor : "#ff7675",
            confirmButtonText : "Xác nhận",
            cancelButtonText:"Hủy"
        }).then((result)=>{
            if(!result.value){
                return false;
            }
            console.log('vo dayt')
            $.ajax({
                url: "/contact/remove-contact",
                type: "delete",
                data: {uid : targetId},
                success: function (response) {
                    if(response.success){
                        $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();
                        $(".people").find(`li[data-chat = ${targetId}]`).remove();
                    }
                }
            });
        })
        
    })
}

$(document).ready(function(){
    removeContact();
})