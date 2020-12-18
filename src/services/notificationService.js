import { reject, resolve } from "bluebird"
import NotificationModel from "./../models/notificationModel"
import UserModel from "./../models/userModel"

const LIMIT_NUMBER_TAKEN=10
let getNotifications = (currentUserId) =>{
    return new Promise(async (resolve, reject) => {
        try {
            let notifications=await NotificationModel.model.getByUserIdAndLimit(currentUserId,LIMIT_NUMBER_TAKEN)
            let getNotifContents = notifications.map(async (notification) => {
                let sender = await UserModel.findUserById(notification.senderId)
                return NotificationModel.contents.getContent(notification.type,notification.isRead,sender._id,sender.username,sender.avatar)
            })
            resolve(await Promise.all(getNotifContents))
        } catch (error) {
            reject(error)
        }
    })
}
let countNotifUnread = (currentUserId, limit = 10) =>{
    return new Promise(async (resolve, reject) => {
        try {
           let countNotifUnread = await NotificationModel.model.countNotifUnread(currentUserId)
           resolve(countNotifUnread)
        } catch (error) {
            reject(error)
        }
    })
}
let readMore = (currentUserId, skipNumberNotification) =>{
    return new Promise(async (resolve, reject) =>{
        try {
            let newNotifications = await NotificationModel.model.readMore(currentUserId, skipNumberNotification,LIMIT_NUMBER_TAKEN)
            let getNotifContents = newNotifications.map(async (notification) => {
                let sender = await UserModel.findUserById(notification.senderId)
                return NotificationModel.contents.getContent(notification.type,notification.isRead,sender._id,sender.username,sender.avatar)
            })
            resolve(await Promise.all(getNotifContents))
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}
module.exports ={
    getNotifications : getNotifications,
    countNotifUnread : countNotifUnread,
    readMore : readMore
}