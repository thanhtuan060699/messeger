import {message} from "./../services/index"

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

module.exports = {
    addNewTextEmoji : addNewTextEmoji
}