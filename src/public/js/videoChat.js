
function videoChat(divId){
    $(`#video-chat-${divId}`).unbind('click').on('click',function(){
        let targetId = $(this).data("chat");
        let callerName = $("#navbat-username").text();
        let dataToEmit = {
            listenId : targetId,
            callerName : callerName
        }
        socket.emit('caller-check-listener-onl-or-not',dataToEmit);
    })

}

function playVideoStream(videoTagId, stream){
    let video = document.getElementById(videoTagId);
    video.srcObject = stream;
    video.onloadeddata = function(){
        video.play();
    }
}

function closeVideoStream(stream){
    return stream.getTracks().forEach(track => track.stop())
}

$(document).ready(function(){
    //off caller
    socket.on("server-send-listener-offline",function(){
        alertify.notify("Người dùng nay hiện tại không online. Vui lòng gọi lại sau", "error", 7);
    })

    let ice = $("#ice-server-list").val();

    let getPeerId = '';
    const peer = new Peer({
        key : "peerjs",
        host : "peerjs-server-trungquandev.herokuapp.com",
        secure : true,
        port : 443,
    });

    peer.on("open",function(peerId){
        getPeerId = peerId
    })
    //listener
    socket.on("server-request-peer-id-of-listener",function(response){
        let listenerName = $("#navbat-username").text();
        let dataToEmit = {
            callerId : response.callerId,
            listenId : response.listenId,
            callerName : response.callerName,
            listenerName : listenerName,
            listenerPeerId : getPeerId
        }
        
        //send to server from listener
        socket.emit("listener-emit-peer-id-to-server",dataToEmit)
    })
    let timerInterval;
    // caller get peerId of caller
    socket.on("server-send-peer-of-listener-to-caller",function(response){
        let dataToEmit = {
            callerId : response.callerId,
            listenId : response.listenId,
            callerName : response.callerName,
            listenerName : response.listenerName,
            listenerPeerId : response.listenerPeerId
        }

        socket.emit("caller-request-call-to-server",dataToEmit)
        Swal.fire({
            title : `Đang gọi cho &nbsp; <span style = "color : #2ECC71">${response.listenerName} </span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
            html : `
            Thời gian : <strong style= 'color : #d43f3a'></strong> giây. <br/>
            <button id='btn-cancel-call' class = 'btn btn-danger'>
                Hủy cuộc gọi
            </button>
            `,
            backdrop : "rgba(85,85,85,0.4)",
            width : "52rem",
            allowOutsideClick : false,
            timer : 30000,
            onBeforeOpen : () =>{
                $("#btn-cancel-call").unbind("click").on("click", function(){
                    Swal.close();
                    clearInterval(timerInterval);
                    //step 07 of caller
                    socket.emit("caller-cancel-request-call-to-server", dataToEmit)
                });

                if(Swal.getContent().querySelector !== null){
                    Swal.showLoading();
                    timerInterval = setInterval(()=>{
                        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000)
                    }, 1000);
                }
               
            },
            onClose :() =>{
                clearInterval(timerInterval)
            },
            onOpen : () =>{
                //reject call from listener to caller
                socket.on("server-send-reject-call-to-caller-from-listener", function(response){
                    Swal.close();
                    clearInterval(timerInterval);
                    Swal.fire({
                        type: "info",
                        title : `<span style = "color : #2ECC71">${response.listenerName} </span> &nbsp; hiện tại không thể nghe máy`,
                        backdrop : "rgba(85,85,85,0.4)",
                        width : "52rem",
                        allowOutsideClick : false,
                        confirmButtonColor : "#2ECC71",
                        confirmButtonText : "Xác thực"
                    })
                });

            }
        }).then((result)=>{
        })
    })

    //listener get call request
    socket.on("server-send-request-call-to-listener", function(response){
        let dataToEmit = {
            callerId : response.callerId,
            listenId : response.listenId,
            callerName : response.callerName,
            listenerName : response.listenerName,
            listenerPeerId : response.listenerPeerId
        }
        //caller request a call
        Swal.fire({
            title : `<span style = "color : #2ECC71">${response.callerName} </span> &nbsp; đang gọi cho bạn <i class="fa fa-volume-control-phone"></i>`,
            html : `
            Thời gian : <strong style= 'color : #d43f3a'></strong> giây. <br/>
            <button id='btn-reject-call' class = 'btn btn-danger'>
                Từ chối
            </button>
            <button id='btn-accept-call' class = 'btn btn-danger'>
                Đồng ý
            </button>
            `,
            backdrop : "rgba(85,85,85,0.4)",
            width : "52rem",
            allowOutsideClick : false,
            timer : 30000,
            onBeforeOpen : () =>{
                $("#btn-reject-call").unbind("click").on("click", function(){
                    Swal.close();
                    clearInterval(timerInterval);
                    //step 07 of caller
                    socket.emit("caller-cancel-request-call-to-server", dataToEmit)
                })

                $("#btn-accept-call").unbind("click").on("click", function(){
                    Swal.close();
                    clearInterval(timerInterval);
                    //step 07 of listener
                    socket.emit("listener-accept-request-call-to-server", dataToEmit)
                })
                if(Swal.getContent().querySelector('strong') !== null){
                    Swal.showLoading();
                    timerInterval = setInterval(()=>{
                        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000)
                    }, 1000);
                }
            },
            onOpen : () =>{
                socket.on("server-send-request-cancel-call-to-listener",function(response){
                    Swal.close();
                    clearInterval(timerInterval);
                    socket.emit("listener-reject-request-call-to-server",dataToEmit);
                })
                
            },
            onClose :() =>{
                clearInterval(timerInterval)
            }
        }).then((result)=>{
        })
    })
    
    //accep caller
    socket.on("server-send-accept-call-to-caller",function(response){
        Swal.close();
        clearInterval(timerInterval);
        var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        getUserMedia({video: true, audio: true}, function(stream) {
            // Show modal streaming
            $("#streamModal").modal("show");

            // Play my stream in local (of caller)
            playVideoStream("local-stream", stream)

            //call to listener
            let call = peer.call(response.listenerPeerId , stream);
            call.on('stream', function(remoteStream) {
                playVideoStream("remote-stream", remoteStream)
            });

            $('#streamModal').on("hidden.bs.modal",function(){
                closeVideoStream(stream);
                Swal.fire({
                    type: "info",
                    title : `Kết thúc cuộc gọi với &nbsp; <span style = "color : #2ECC71">${response.listenerName} </span> `,
                    backdrop : "rgba(85,85,85,0.4)",
                    width : "52rem",
                    allowOutsideClick : false,
                    confirmButtonColor : "#2ECC71",
                    confirmButtonText : "Xác thực"
                })
            })
          }, function(err) {
            console.log('Failed to get local stream' ,err);
        });
    })

    //accep listener
    socket.on("server-send-accept-call-to-listener",function(response){
        Swal.close();
        clearInterval(timerInterval);
        var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        peer.on('call', function(call) {
            getUserMedia({video: true, audio: true}, function(stream) {
              // Show modal streaming
              $("#streamModal").modal("show");
              // Play my stream in local (of listener)
              playVideoStream("local-stream", stream);

              call.answer(stream); // Answer the call with an A/V stream.

              call.on('stream', function(remoteStream) {
                 playVideoStream("remote-stream", remoteStream)
              });

              //Close Modal : Remove stream
              $('#streamModal').on("hidden.bs.modal",function(){
                  closeVideoStream(stream);
                  Swal.fire({
                    type: "info",
                    title : `Kết thúc cuộc gọi với &nbsp; <span style = "color : #2ECC71">${response.callerName} </span> `,
                    backdrop : "rgba(85,85,85,0.4)",
                    width : "52rem",
                    allowOutsideClick : false,
                    confirmButtonColor : "#2ECC71",
                    confirmButtonText : "Xác thực"
                })
              })
            }, function(err) {
              console.log('Failed to get local stream' ,err);
            });
        });
    })

})