import _ from "lodash";
import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import MessageModel from "./../models/messangeModel";
import fsExtra from "fs-extra"



const LIMIT_CONVERSATIONS_TAKEN = 15
const LIMIT_MESSAGES_TAKEN = 30

let getAllConversationItems = (currentUserId) =>{
     return new Promise(async (resolve, reject) =>{
         try {
             let contacts = await ContactModel.getContactsFromUserId(currentUserId, LIMIT_CONVERSATIONS_TAKEN)
             let userConversationPromise = contacts.map(async (contact)=>{
                if(contact.contactId == currentUserId){
                    return await UserModel.findUserById(contact.userId)
                }else{
                    return await UserModel.findUserById(contact.contactId)
                }
             })
             let userConversations = await Promise.all(userConversationPromise)
             let allConversationWithMessagesPromise= userConversations.map(async(userConversation)=>{
                 let getMessages = await MessageModel.model.getMessages(currentUserId,userConversation._id,LIMIT_MESSAGES_TAKEN)
                 userConversation = userConversation.toObject()
                 userConversation.messages = _.reverse(getMessages)
                 return userConversation
             })
             
             let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise)
             // sort by updateAt
             allConversationWithMessages = _.sortBy(allConversationWithMessages,(item)=>{
                return -item.updateAt
             })
            
             resolve({
                 userConversations : userConversations,
                 allConversationWithMessages : allConversationWithMessages
             })
         } catch (error) {
             console.log(error)
             reject(error)
         }
     })
}

let addNewTextEmoji = (sender,receivedId,messageVal) =>{
    return new Promise(async (resolve,reject) =>{
        try {
            let receiverModel = await UserModel.findUserById(receivedId)
            let receiver = {
                id : receiverModel._id,
                name : receiverModel.username,
                avatar : receiverModel.avatar
            }
            let newMessageItem = {
                senderId : sender.id,
                receiverId : receiver.id,
                conversationType : MessageModel.conversationType.PERSONAL,
                messageType : MessageModel.messageType.TEXT,
                sender : sender,
                receiver : receiver,
                text : messageVal,
                createAt : Date.now()
            }
            let newMessage = await MessageModel.model.createNew(newMessageItem)
            await ContactModel.updateWhenHasNewMessage(sender.id,receiver.id)
            resolve(newMessage)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

let addNewImageMessage = (sender,receivedId,messageVal) =>{
    return new Promise(async (resolve,reject) =>{
        try {
            let receiverModel = await UserModel.findUserById(receivedId)
            let receiver = {
                id : receiverModel._id,
                name : receiverModel.username,
                avatar : receiverModel.avatar
            }

            let imageBuffer = await fsExtra.readFile(messageVal.path);
            let imageContentType = messageVal.minetype;
            let imageName = messageVal.originalname;

            let newMessageItem = {
                senderId : sender.id,
                receiverId : receiver.id,
                conversationType : MessageModel.conversationType.PERSONAL,
                messageType : MessageModel.messageType.IMAGE,
                sender : sender,
                receiver : receiver,
                file : {data : imageBuffer, contentType : imageContentType, fileName : imageName},
                createAt : Date.now()
            }
            let newMessage = await MessageModel.model.createNew(newMessageItem)
            await ContactModel.updateWhenHasNewMessage(sender.id,receiver.id)
            resolve(newMessage)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

let addNewAttachmentChat = (sender,receivedId,messageVal) =>{
    return new Promise(async (resolve,reject) =>{
        try {
            let receiverModel = await UserModel.findUserById(receivedId)
            let receiver = {
                id : receiverModel._id,
                name : receiverModel.username,
                avatar : receiverModel.avatar
            }

            let attachmentBuffer = await fsExtra.readFile(messageVal.path);
            let attachmentContentType = messageVal.minetype;
            let attachmentName = messageVal.originalname;

            let newMessageItem = {
                senderId : sender.id,
                receiverId : receiver.id,
                conversationType : MessageModel.conversationType.PERSONAL,
                messageType : MessageModel.messageType.FILE,
                sender : sender,
                receiver : receiver,
                file : {data : attachmentBuffer, contentType : attachmentContentType, fileName : attachmentName},
                createAt : Date.now()
            }
            let newMessage = await MessageModel.model.createNew(newMessageItem)
            await ContactModel.updateWhenHasNewMessage(sender.id,receiver.id)
            resolve(newMessage)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

module.exports ={
    getAllConversationItems : getAllConversationItems,
    addNewTextEmoji : addNewTextEmoji,
    addNewImageMessage : addNewImageMessage,
    addNewAttachmentChat : addNewAttachmentChat
}