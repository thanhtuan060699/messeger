import { sortBy } from "lodash"
import mongoose from "mongoose"

let Schema=mongoose.Schema

let MessageSchema=new Schema({
    senderId : String,
    receiverId : String,
    conversationType : String,
    messageType :String,
    conversationType :String,
    sender:{
        id:String,
        username:String,
        avatar:String
    },
    receiver:{
        id:String,
        username:String,
        avatar:String
    },
    text:String,
    file:{
        data:Buffer,
        contentType:String,
        fileName:String
    },
    createdAt:{type:Number,default:Date.now},
    updateddAt:{type:Number,default:null},
    deletedAt:{type:Number,default:null},
})

MessageSchema.statics ={
    getMessages(senderId, receiverId, limit){
        return this.find({
            $or : [
                {$and : [
                    {"senderId": senderId},
                    {"receiverId" : receiverId}
                ]},
                {$and : [
                    {"senderId": receiverId},
                    {"receiverId" : senderId}
                ]}
                
            ]
        }).sort({"createdAt" : -1}).limit(limit).exec()
    },
    createNew(item){
        return this.create(item)
    }

}
const MESSAGE_CONVERSATION_TYPES = {
    PERSONAL : "personal",
    GROUP : "group"
}
const MESSAGE_TYPES = {
    TEXT : "text",
    IMAGE : "image",
    FILE : "file"
}
module.exports={
    model : mongoose.model("message",MessageSchema),
    conversationType : MESSAGE_CONVERSATION_TYPES,
    messageType : MESSAGE_TYPES
}