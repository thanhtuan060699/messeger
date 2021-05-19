import multer from "multer"
import {transErrors,transSuccess} from "./../../lang/vi"
import uuidv4 from "uuid/v4"
import {user} from "./../services/index"
import bcrypt from "bcrypt"


let storageAvatar= multer.diskStorage({
    destination:(req,file,callback) =>{
        callback(null,"src/public/images/users")
    },
    filename :(req,file,callback) =>{
        let math=["image/png","image/jpg","image/jpeg"]
        if(math.indexOf(file.mimetype)===-1){
            return callback(transErrors.avatar_type,null)
        }

        let avatarName =`${Date.now()}-${uuidv4()}-${file.originalname}`
        callback(null,avatarName)
    }
})

let avatarUploadFile = multer({
    storage : storageAvatar,
    limits:{fileSize:1048576}
}).single("avatar")

let updateAvatar= (req,res) => {
    avatarUploadFile(req,res,async (error)=>{
        if(error){
            return res.status(500).send(transErrors.avatar_size)
        }
        try {
            let updateUserItem = {
                avatar : req.file.filename,
                updateAt : Date.now()
            }
            //Update user
            let userUpdate=await user.updateUser(req.user._id,updateUserItem)

            //Remove old user avatar
            //fxExtra.remove("src/public/images/users/"+userUpdate.avatar)
            let result ={
                message:transSuccess.avatar_updated,
                imageSrc :`/images/users/${req.file.filename}`
            }
            return res.status(200).send(result)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    })
}
let updateUserInfo =async (req,res) =>{
    try {
        let updateUserItem=req.body
        await user.updateUser(req.user._id,updateUserItem)
        let result ={
            message:transSuccess.userInfo_updated,
        }
        return res.status(200).send(result)
    } catch (error) {
        return res.status(500).send({message:transSuccess.error})
    }
}

let changePassword=async (req,res) =>{
    try {
        let changePassword = req.body;
        let results= await user.changePassword(req.user._id, changePassword);
        let result = {
            status :200,
            message : transSuccess.user_change_password 
        }
        return res.status(200).send(result);
    } catch (error) {
        return res.status(200).send({
            status :500,
            message:error});
    }
}
module.exports = {
    updateAvatar: updateAvatar,
    updateUserInfo : updateUserInfo,
    changePassword : changePassword
}