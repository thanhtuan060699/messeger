function callFindUsers(element){
    if(element.which=== 13 || element.type=== "click"){
        let keyword=$("#input-find-users-contact").val()
        if(!keyword.length){
            alertify.notify("Chưa nhập nội dung tìm kiếm ","error",7)
            return false
        }
        $.get(`/contact/find-user/${keyword}`,function(data){
            $("#find-user ul").html(data)
            addContact()    // js/addContact
            removeRequestContact()
        })
    }
}
$(document).ready(function(){
    $("#input-find-users-contact").bind("keypress",callFindUsers)
    $("#btn-find-users-contact").bind("click",callFindUsers)
})