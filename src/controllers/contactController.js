import {contact, user} from "./../services/index"


let findUsersContact = async (req,res) =>{
    try {
        let currentUserId=req.user._id
        let keyword = req.params.keyword

        let users =await contact.findUsersContact(currentUserId,keyword)
        return res.render("main/contacts/sections/_findUserContact",{users})
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

let addNewContact = async (req,res) =>{
    try {
        let currentUserId=req.user._id
        let contactId = req.body.uid
        let newContact=await contact.addNew(currentUserId,contactId)
        return res.status(200).send({success : !!newContact})
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

let removeRequestContact = async (req,res) =>{
    try {
        let currentUserId=req.user._id
        let contactId = req.body.uid
        let remove=await contact.removeRequestContact(currentUserId,contactId)
        return res.status(200).send({success : !!remove})
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

module.exports ={
    findUsersContact : findUsersContact,
    addNewContact : addNewContact,
    removeRequestContact : removeRequestContact
}