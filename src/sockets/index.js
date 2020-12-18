import addNewContact from "./contact/addNewContact"
import removeRequestContact from "./contact/removeRequestContact"
import removeRequestContactReceived from "./contact/removeRequestContactReceivedSocket"
import approveRequestContactReceived from "./contact/approveRequestContactReceivedSocket"

let initSocket=(io)=>{
    addNewContact(io)
    removeRequestContact(io)
    removeRequestContactReceived(io)
    approveRequestContactReceived(io)
}
module.exports =initSocket