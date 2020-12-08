import mongoose from "mongoose"

let Schema=mongoose.Schema

let chatGroupSchema=new Schema({
    name:String,
    usersAmount:{type:Number,min:3,max:177},
    messagesAmount:{type:Number,default:0},
    userId:String,
    members:[
        {userId:String}
    ],
    createdAt:{type:Number,default:Date.now},
    updateddAt:{type:Number,default:null},
    deletedAt:{type:Number,default:null},
})
module.exports=mongoose.model("chat-group",chatGroupSchema)