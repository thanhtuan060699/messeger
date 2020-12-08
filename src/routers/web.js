import express from "express"
import {home,auth,user,contact,notification} from "./../controllers/index"
import {authValid} from "./../validation/index"
import passport from 'passport'
import initPassportLocal from './../controllers/passportController/local'


//init all passport
initPassportLocal()

let router=express.Router()

let initRouters=(app)=>{
    router.get("/",home.getHome)
    router.get("/login-register",auth.getLoginRegister);
    router.post("/register",authValid.register,auth.postRegister)
    router.get("/verify/:token",auth.verifyAccount)
    router.post("/login",passport.authenticate("local",{
        successRedirect:"/",
        failureRedirect:"login-register",
        successFlash:true,
        failureFlash:true
    }))

    router.get("/auth/facebook",passport.authenticate("facebook",{scope:["email"]}))
    router.get("/auth/facebook/callback",passport.authenticate("facebook",{
        successRedirect:"/",
        failureRedirect:"login-register",
    }))

    router.get("/logout",auth.getLogout)
    router.put("/user/update-avatar",user.updateAvatar)
    router.put("/user/update-info",user.updateUserInfo)
    router.get("/contact/find-user/:keyword",contact.findUsersContact)
    router.post("/contact/add-new",contact.addNewContact)
    router.delete("/contact/remove-request-contact",contact.removeRequestContact)
    router.get("/notification/read-more",notification.readMore)
    return app.use("/",router)

    
}
module.exports=initRouters