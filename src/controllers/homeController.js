import {notification,contact,message} from "./../services/index"
import {bufferToBase64} from "./../helpers/clientHelper"
import request from "request"

let getICETurnServer = () =>{
    return new Promise( async (resolve, reject)=>{
        // Node Get ICE STUN and TURN list
        let o = {
            format: "urls"
        };

        let bodyString = JSON.stringify(o);
        let options = {
            url : "https://global.xirsys.net/_turn/chat-real",
            method: "PUT",
            headers: {
                "Authorization": "Basic " + Buffer.from("thanhtuanhlal:143bd092-9773-11eb-ae32-0242ac150002").toString("base64"),
                "Content-Type": "application/json",
                "Content-Length": bodyString.length
            }
        };
        // request(options,function(error, response, body){
        //     if(error){
        //         console.log(error)
        //         return reject(error)
        //     }
        //     let bodyJson = JSON.parse(body)
        //     resolve(bodyJson.v.iceServers)
        // })
        resolve(null)
    })
}
 

let getHome= async (req,res)=>{
    //only 10 items one time
    let notifications =  await notification.getNotifications(req.user._id)
    
    // get amount notifications unread
    let countNotifUnread = await notification.countNotifUnread(req.user._id) 

    //get contacts (10 items one time)
    let contacts = await contact.getContactsFromUserId(req.user._id)

    //get contacts sent (10 items one time)
    let contactsSent = await contact.getContactsSent(req.user._id)

    //get contacts received (10 items one time) 
    let contactsReceived = await contact.getContactsReceived(req.user._id)

    //count contacts
    let countAllContacts = await contact.countAllContacts(req.user._id);
    let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
    let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);
    let getAllConversationItems = await message.getAllConversationItems(req.user._id);

    let userConversations = getAllConversationItems.userConversations;
    console.log(userConversations)
    let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;
    let iceServerList = await getICETurnServer();

    return res.render("main/master",{
        errors : req.flash("errors"),
        success : req.flash("success"),
        user : req.user,
        notifications : notifications,
        countNotifUnread : countNotifUnread,
        contacts : contacts,
        contactsSent : contactsSent,
        contactsReceived : contactsReceived,
        countAllContacts : countAllContacts,
        countAllContactsSent : countAllContactsSent,
        countAllContactsReceived : countAllContactsReceived,
        userConversations : userConversations,
        allConversationWithMessages : allConversationWithMessages,
        bufferToBase64 : bufferToBase64,
        iceServerList : JSON.stringify(iceServerList)
    })


}



module.exports={
    getHome : getHome,
}