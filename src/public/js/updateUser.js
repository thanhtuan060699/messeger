let userAvatar=null
let userInfo={}
let originAvatarSrc = null
let originUserInfo={}

function updateUserInfo(){
    $("#input-change-avatar").bind("change",function(){

        let fileData=$(this).prop("files")[0];
        let math=["image/png","image/jpg","image/jpeg"]
        let limit=1048576 //byte = 1 MB

        if($.inArray(fileData.type,math) === -1){
            alertify.notify("Kiểu file không hợp lệ,chỉ chấp nhận jpg & png","error",7)
            $(this).val(null)
            return false
        }

        if(fileData.size >limit){
            alertify.notify("Chỉ chấp nhận ảnh dưới 1 MB ","error",7)
            $(this).val(null)
            return false
        }

        if(typeof (FileReader) !="underfined"){
            let imagePreview=$("#image-edit-profile")
            imagePreview.empty()

            let fileReader=new FileReader()
            fileReader.onload=function(element){
                $("<img>",{
                    "src":element.target.result,
                    "class":"avatar img-circle",
                    "id": "user-modal-avatar",
                    "alt":"avatar"
                }).appendTo(imagePreview)
            }
            imagePreview.show()
            fileReader.readAsDataURL(fileData)

            let formData=new FormData()
            formData.append("avatar",fileData)
            userAvatar=formData
        }else{
            alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader","error",7)
        }
    })
    $("#input-change-username").bind("change",function(){
        userInfo.username=$(this).val()
    })
    $("#input-change-gender-male").bind("click",function(){
        userInfo.gender=$(this).val()
    })
    $("#input-change-gender-female").bind("click",function(){
        userInfo.gender=$(this).val()
    })
    $("#input-change-address").bind("change",function(){
        userInfo.address=$(this).val()
    })
    $("#input-change-phone").bind("change",function(){
        userInfo.phone=$(this).val()
    })
}

function callUpdateAvatar(){
    $.ajax({
        type: "put",
        url: "/user/update-avatar",
        cache: false,
        contentType:false,
        processData:false,
        data:userAvatar,
        success: function (response) {
            $(".user-modal-alert-success").find("span").text(response.message)
            $(".user-modal-alert-success").css("display","block")
            $("#navbar-avatar").attr("src",response.imageSrc)
            originAvatarSrc=response.imageSrc
        },
        error :function(error){
            console.log(error)
        }
    });
}
function callUpdateUserInfo(){
    $.ajax({
        type: "put",
        url: "/user/update-info",
        data:userInfo,
        success: function (response) {
            $(".user-modal-alert-success").find("span").text(response.message)
            $(".user-modal-alert-success").css("display","block")

            originUserInfo=Object.assign(originUserInfo,userInfo)

            //update username at navbar
            $("#navbar-username").text(originUserInfo.username)

            //reset all
            $("#input-btn-cancel-update-user").click()
        },
        error :function(error){
            console.log(error)
        }
    });
}
$(document).ready(function(){
    
    
    originAvatarSrc = $("#user-modal-avatar").attr("src")
    originUserInfo ={
        username : $("#input-change-username").val(),
        gender : ($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val():$("#input-change-gender-female").val(),
        address : $("#input-change-address").val(),
        phone : $("#input-change-phone").val(),
    }

    updateUserInfo()

    $("#input-btn-update-user").bind("click",function(){
        if($.isEmptyObject(userInfo) && !userAvatar){
            alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu ","error",7)
            return false
        }
        if(userAvatar){
            callUpdateAvatar()
        }
        if(!$.isEmptyObject(userInfo)){
            callUpdateUserInfo()
        }
    })

    $("#input-btn-cancel-update-user").bind("click",function(){
        userAvatar=null
        userInfo={}
        $("#user-modal-avatar").attr("src",originAvatarSrc)
        $("#input-change-username").val(originUserInfo.username)
        if(originUserInfo.gender==="male")  
            $("#input-change-gender-male").click() 
        else 
            $("#input-change-gender-female").click()

        $("#input-change-address").val(originUserInfo.address)
        $("#input-change-phone").val(originUserInfo.phone)
    })
    
})