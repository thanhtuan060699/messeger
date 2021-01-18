import addNewContact from "./contact/addNewContactSocket"
import removeRequestContact from "./contact/removeRequestContactSocket"
import removeRequestContactReceived from "./contact/removeRequestContactReceivedSocket"
import approveRequestContactReceived from "./contact/approveRequestContactReceivedSocket"
import chatTextEmojiSocket from "./chat/chatTextEmojiSocket"

let initSocket=(io)=>{
    addNewContact(io)
    removeRequestContact(io)
    removeRequestContactReceived(io)
    approveRequestContactReceived(io)
    chatTextEmojiSocket(io)
}
module.exports =initSocket