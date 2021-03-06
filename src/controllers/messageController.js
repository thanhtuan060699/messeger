import {message} from "./../services/index";
import multer from "multer";
import {transErrors,transSuccess} from "./../../lang/vi";
import {app} from "./../config/app";

let addNewTextEmoji =  async(req,res) =>{
    try {
        let sender = {
            id: req.user._id,
            name : req.user.username,
            avatar : req.user.avatar
        }
        let receivedId = req.body.targetId
        let messageVal = req.body.messageVal

        let newMessage = await message.addNewTextEmoji(sender,receivedId,messageVal)
        return res.status(200).send({message : newMessage})
    } catch (error) {
        console.log(error)
    }
}

let storageImageChat = multer.diskStorage({
    destination:(req,file,callback) =>{
        callback(null, "src/public/images/chat/message")
    },
    filename :(req,file,callback) =>{
        let math=["image/png","image/jpg","image/jpeg"]
        if(math.indexOf(file.mimetype)===-1){
            return callback(transErrors.message_image_type,null)
        }

        let imageName =`${Date.now()}-${file.originalname}`
        callback(null,imageName)
    }
})

let imageMessageUploadFile = multer({
    storage : storageImageChat,
    limits  : {fileSize:1048576}
}).single("my-file-chat")

let storageAttachmentChat = multer.diskStorage({
    destination:(req,file,callback) =>{
        callback(null, "src/public/images/chat/message")
    },
    filename :(req,file,callback) =>{
        let imageName =`${file.originalname}`
        callback(null,imageName)
    }
})

let attachmentMessageUploadFile = multer({
    storage : storageAttachmentChat,
    limits  : {fileSize:1048576}
}).single("my-attachment-chat")


let addNewImageMessage = (req,res) =>{
    imageMessageUploadFile(req, res, async (error)=>{
        if(error){
            return res.status(500).send(transErrors.avatar_size)
        }

        try {
            let sender = {
                id: req.user._id,
                name : req.user.username,
                avatar : req.user.avatar
            };
            let receivedId = req.body.uid;
            let messageVal = req.file;
            let newMessage = await message.addNewImageMessage(sender,receivedId,messageVal)

            //Remove image, because this image is saved in mongodb
            return res.status(200).send({message : newMessage})
        } catch (error) {
            console.log(error)
        }
    });   
}
let addNewAttachmentChat =function(req,res){
    attachmentMessageUploadFile(req, res, async (error)=>{
        if(error){
            return res.status(500).send(transErrors.avatar_size)
        }

        try {
            let sender = {
                id: req.user._id,
                name : req.user.username,
                avatar : req.user.avatar
            };
            let receivedId = req.body.uid;
            let messageVal = req.file;
            let newMessage = await message.addNewAttachmentChat(sender,receivedId,messageVal)

            //Remove image, because this image is saved in mongodb
            return res.status(200).send({message : newMessage})
        } catch (error) {
            console.log(error)
        }
    }); 
}


module.exports = {
    addNewTextEmoji : addNewTextEmoji,
    addNewImageMessage : addNewImageMessage,
    addNewAttachmentChat : addNewAttachmentChat
}