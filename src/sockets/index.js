import addNewContact from "./contact/addNewContact"
import removeRequestContact from "./contact/removeRequestContact"

let initSocket=(io)=>{
    addNewContact(io)
    removeRequestContact(io)
}
module.exports =initSocket