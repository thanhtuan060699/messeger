import addNewContact from "./contact/addNewContactSocket";
import removeRequestContact from "./contact/removeRequestContactSocket";
import removeRequestContactReceived from "./contact/removeRequestContactReceivedSocket";
import approveRequestContactReceived from "./contact/approveRequestContactReceivedSocket";
import chatTextEmojiSocket from "./chat/chatTextEmojiSocket";
import chatVideo from "./chat/chatVideoSocket";

let initSocket=(io)=>{
    addNewContact(io);
    removeRequestContact(io);
    removeRequestContactReceived(io);
    approveRequestContactReceived(io);
    chatTextEmojiSocket(io);
    chatVideo(io);
}
module.exports =initSocket