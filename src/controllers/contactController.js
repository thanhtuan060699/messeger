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

let removeRequestContactSent = async (req,res) =>{
    try {
        let currentUserId=req.user._id
        let contactId = req.body.uid
        let remove=await contact.removeRequestContactSent(currentUserId,contactId)
        return res.status(200).send({success : !!remove})
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

let removeRequestContactReceived = async (req,res) => {
    try {
        let contactId = req.user._id
        let userId = req.body.uid
        let remove = await contact.removeRequestContactReceived(userId,contactId)
        return res.status(200).send({success : "success"})
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}
let approveRequestContactReceived = async (req,res) =>{
    try {
        let userId = req.user._id
        let contactId = req.body.uid
        let userContactModel = await contact.approveRequestContactReceived(userId, contactId)
        return res.status(200).send({userContactModel : userContactModel})
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

let removeContact = async(req,res) =>{
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;
        let removeContact = await contact.removeContact(currentUserId, contactId);
        return res.status(200).send({success : !!removeContact})
        
    } catch (error) {
        console.log(error)
    }
}



module.exports ={
    findUsersContact : findUsersContact,
    addNewContact : addNewContact,
    removeRequestContactSent : removeRequestContactSent,
    removeRequestContactReceived : removeRequestContactReceived,
    approveRequestContactReceived : approveRequestContactReceived,
    removeContact : removeContact
}