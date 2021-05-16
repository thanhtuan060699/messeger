import UserModel from "./../models/userModel"
import bcrypt from "bcrypt"
import {transErrors,transSuccess} from "./../../lang/vi"

const saltRounds =7;
let updateUser =(id, item) =>{
    return UserModel.updateUser(id,item)
}

let changePassword=(id, dataUpdate) =>{
    return new Promise(async (resolve, reject)=>{
        let currentUser = await UserModel.findUserById(id);
        let checkCurrentPassword = await currentUser.comparePassword(dataUpdate.currentPassword)
        if(!checkCurrentPassword){
            return reject(transErrors.current_password_failed);
        }

        let salt = bcrypt.genSaltSync(saltRounds);
        await UserModel.updatePassword(id, bcrypt.hashSync(dataUpdate.password, salt));
        resolve(true)
    })
}

module.exports ={
    updateUser : updateUser,
    changePassword : changePassword
}