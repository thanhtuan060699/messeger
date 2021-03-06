import mongoose from "mongoose"

let Schema=mongoose.Schema

let ContactSchema=new Schema({
    userId:String,
    contactId:String,
    status:{type:Boolean,default:false},
    createdAt:{type:Number,default:Date.now},
    updateddAt:{type:Number,default:null},
    deletedAt:{type:Number,default:null},
})

ContactSchema.statics={
    createNew(item){
        return this.create(item);
    },

    findAllByUser(userId){
        return this.find({
            $or :[
                {"userId":userId},
                {"contactId":userId}
            ]
        }).exec()
    },
    checkExisted(userId, contactId){
        return this.findOne({
            $or : [
                {
                    $and :[
                        {"userId" : userId},
                        {"contactId" : contactId}
                    ]
                },
                {
                    $and :[
                        {"userId" : contactId},
                        {"contactId" : userId}
                    ]
                },
            ]
        }).exec()
    },
    removeContact(userId, contactId){
        return this.remove({
            $or : [
                {
                    $and :[
                        {"userId" : userId},
                        {"contactId" : contactId},
                        {"status" : true}
                    ]
                },
                {
                    $and :[
                        {"userId" : contactId},
                        {"contactId" : userId},
                        {"status" : true}
                    ]
                },
            ]
        }).exec()
    },
    removeRequestContactSent(userId,contactId){
        return this.remove({
            $and : [
                {"userId" : userId},
                {"contactId" : contactId}
            ]
        }).exec()
    },
    getContactsFromUserId(userId, limit){
        return this.find({
            $and : [
                {
                    $or :[
                        {"userId" : userId},
                        {"contactId" : userId}
                    ]
                },
                {"status" : true}
            ]
        }).sort({"createdAt" : -1}).limit(limit).exec()
    },
    getContactsSent(userId, limit){
        return this.find({
            $and : [
                {"userId" : userId},
                {"status" : false}
            ]
        }).sort({"createdAt" : -1}).limit(limit).exec()
    },
    getContactsReceived(userId, limit){
        return this.find({
            $and : [
                {"contactId" : userId},
                {"status" : false}
            ]
        }).sort({"createdAt" : -1}).limit(limit).exec()
    },
    countAllContacts(userId){
        return this.count({
            $and : [
                {
                    $or :[
                        {"userId" : userId},
                        {"contactId" : userId}
                    ]
                },
                {"status" : true}
            ]
        }).exec()
    },
    countAllContactsSent(userId){
        return this.count({
            $and : [
                {"userId" : userId},
                {"status" : false}
            ]
        }).exec()
    },
    countAllContactsReceived(userId){
        return this.count({
            $and : [
                {"contactId" : userId},
                {"status" : false}
            ]
        }).exec()
    },
    removeRequestContactReceived(userId,contactId){
        return this.remove({
            $and : [
                {"userId" : userId},
                {"contactId" : contactId}
            ]
        }).exec()
    },
    approveRequestContactReceived(userId,contactId){
        return this.update({
            $and : [
                {"userId" : contactId},
                {"contactId" : userId},
                {"status" : false}
            ]
        },{"status" : true}).exec()
    },

    updateWhenHasNewMessage(userId,contactId){
        return this.update({
            $or : [
                {$and : [
                    {"userId" : contactId},
                    {"contactId" : userId}
                ]},
                {$and : [
                    {"userId" : userId},
                    {"contactId" : contactId}
                ]}
            ]
        },{"updateddAt" : Date.now()})
    }

};

module.exports=mongoose.model("contact",ContactSchema)