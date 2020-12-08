$(document).ready(function(){
    $("#link-read-more-notif").bind("click",function(){
        let skipNumber = $("ul.list-notifications").find("li").length
        $.get(`/notification/read-more?skipNumber=${skipNumber}`,function(notifications){
            console.log(notifications)
        })
    })
})