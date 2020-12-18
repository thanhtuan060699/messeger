import ContactModel from "./../models/contactModel"
import UserModel from "./../models/userModel"
import NotificationModel from "./../models/notificationModel"
import _ from "lodash"



const LIMIT_NUMBER_TAKEN=10
let findUsersContact = (currentUserId,keyword) =>{
    return new Promise(async (resolve,reject)=>{
        let deprecatedUserIds = []
        let contactsByUser = await ContactModel.findAllByUser(currentUserId)
        contactsByUser.forEach((contact)=>{
            deprecatedUserIds.push(contact.userId)
            deprecatedUserIds.push(contact.contactId)
        })
        deprecatedUserIds=_.uniqBy(deprecatedUserIds)
        let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword)
        resolve(users)
    })
}
let addNew = (currentUserId,contactId) =>{
    return new Promise(async (resolve,reject)=>{
        let contactExists= await ContactModel.checkExisted(currentUserId,contactId)
        if(contactExists){
            return reject(false)
        }
        //create contact
        let newContactItem ={
            userId : currentUserId,
            contactId : contactId
        }
        let newContact = await ContactModel.createNew(newContactItem)

        //create notification
        let notificationItem = {
            senderId : currentUserId,
            receiverId : contactId,
            type : NotificationModel.types.ADD_CONTACT
        }
        await NotificationModel.model.createNew(notificationItem)
        resolve(newContact)
    })
}
let removeRequestContactSent = (currentUserId,contactId) =>{
    return new Promise(async (resolve,reject)=>{
      let removeReq = await ContactModel.removeRequestContactSent(currentUserId,contactId)
      if(removeReq.n === 0)
        return reject(false)

      // remove notification
      let notiTypeAddContact=NotificationModel.types.ADD_CONTACT
      await NotificationModel.model.removeRequestContactNotification(currentUserId,contactId,notiTypeAddContact)

      return resolve(true)
    })
}

let getContactsFromUserId = (currentUserId) =>{
    return new Promise(async (resolve,reject) => {
        try {
            let contacts = await ContactModel.getContactsFromUserId(currentUserId,LIMIT_NUMBER_TAKEN)
            let users = contacts.map(async (contact) => {
               if(contact.contactId == currentUserId){
                return await UserModel.findUserById(contact.userId)
               }else{
                return await UserModel.findUserById(contact.contactId)
               }
               
            })
            resolve(await Promise.all(users))
        } catch (error) {
            reject(error)
        }
    })
}

let getContactsSent = (currentUserId) =>{
    return new Promise(async (resolve,reject) => {
        try {
            let contacts = await ContactModel.getContactsSent(currentUserId,LIMIT_NUMBER_TAKEN)
            let users = contacts.map(async (contact) => {
               return await UserModel.findUserById(contact.contactId)
            })
            resolve(await Promise.all(users))
        } catch (error) {
            reject(error)
        }
    })
}

let getContactsReceived = (currentUserId) =>{
    return new Promise(async (resolve,reject) => {
        try {
            let contacts = await ContactModel.getContactsReceived(currentUserId,LIMIT_NUMBER_TAKEN)
            let users = contacts.map(async (contact) => {
               return await UserModel.findUserById(contact.userId)
            })
            resolve(await Promise.all(users))
        } catch (error) {
            reject(error)
        }
    })
}

let countAllContacts= (currentUserId) =>{
    return new Promise(async (resolve,reject) =>{
        try {
            let count = await ContactModel.countAllContacts(currentUserId)
            resolve(count)
        } catch (error) {
            console(error)
            reject(error)
        }
    })
}

let countAllContactsSent = (currentUserId) =>{
    return new Promise(async (resolve,reject) =>{
        try {
            let count = await ContactModel.countAllContactsSent(currentUserId)
            resolve(count)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

let countAllContactsReceived = (currentUserId) =>{
    return new Promise(async (resolve,reject) =>{
        try {
            let count = await ContactModel.countAllContactsReceived(currentUserId)
            resolve(count)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

let removeRequestContactReceived = (userId, contactId) =>{
    return new Promise(async (resolve,reject) =>{
        try {
            let remove = await ContactModel.removeRequestContactReceived(userId ,contactId)
            if(remove.n === 0)
                return reject(false)
            return resolve(true)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

let approveRequestContactReceived = (userId, contactId) =>{
    return new Promise(async (resolve,reject)=>{
        try {
            let update =await ContactModel.approveRequestContactReceived(userId, contactId)
            if(update.n === 1){
                let userContactModel = await UserModel.findUserById(contactId)
                let userReturn = {
                    id : userContactModel._id,
                    avatar : userContactModel.avatar,
                    address : userContactModel.address,
                    username : userContactModel.username
                }
                resolve(userReturn)
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
        
    })
}

module.exports ={
    findUsersContact : findUsersContact,
    addNew : addNew,
    removeRequestContactSent : removeRequestContactSent,
    getContactsFromUserId : getContactsFromUserId,
    getContactsSent : getContactsSent,
    getContactsReceived : getContactsReceived,
    countAllContacts: countAllContacts,
    countAllContactsSent : countAllContactsSent,
    countAllContactsReceived : countAllContactsReceived,
    removeRequestContactReceived : removeRequestContactReceived,
    approveRequestContactReceived : approveRequestContactReceived
}