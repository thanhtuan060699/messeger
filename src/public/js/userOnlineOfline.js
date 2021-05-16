socket.on("server-send-list-online", function(listUserId){
    console.log('vp dau ')
    listUserId.forEach(userId =>{
        $(`.person[data-chat=${userId}]`).find("div.dot").addClass('online')
        $(`.person[data-chat=${userId}]`).find("img").addClass('avatar-online')
    })
})

socket.on("server-send-when-new-server-online",function(userId){
    console.log('vo on line')
    $(`.person[data-chat=${userId}]`).find("div.dot").addClass('online')
    $(`.person[data-chat=${userId}]`).find("img").addClass('avatar-online')
})

socket.on("server-send-when-new-server-ofline",function(userId){
    $(`.person[data-chat=${userId}]`).find("div.dot").removeClass('online')
    $(`.person[data-chat=${userId}]`).find("img").removeClass('avatar-online')
})