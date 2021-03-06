import {notification} from "./../services/index"
let readMore =async (req,res) =>{
    try {
        //get skip number from query param
        let skipNumberNotification =+(req.query.skipNumber) 
        let newNotifications = await notification.readMore(req.user._id, skipNumberNotification)
        return res.status(200).send(newNotifications)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

module.exports={
    readMore : readMore
}