import passport from "passport"
import passportFacebook from "passport-facebook"
import UserModel from "./../../models/userModel"
import {transErrors,transSuccess} from "./../../../lang/vi"

let FacebookStrategy=passportFacebook.Strategy;

let FB_APP_ID="1307335526293341"
let FB_APP_SECRET="d142d4537d4062bc5fa36f3578efe051"
let FB_CALLBACK_URL="https://localhost:8017/auth/facebook/callback"

let initPassportFacebook =()=>{
    passport.use(new FacebookStrategy({
        clientID : FB_APP_ID,
        clientSecret :FB_APP_SECRET,
        callbackURL : FB_CALLBACK_URL,
        passReqToCallback:true,
        profileFields: ["email","gender","displayName"]
    },async (req,accessToken,refreshToken,profile,done)=>{
        try {
            let user=await UserModel.findByFacebookUid(profile.id)
            if(user){
                return done(null,user,req.flash("success",transSuccess.loginSuccess(user.username)))
            }
            console.log(profile)
            let newUserItem={
                username : profile.displayName,
                gender : profile.gender,
                local : {isActive:true},
                facebook :{
                    uid:profile.id,
                    token:accessToken,
                    email:profile.emails[0].value
                }
            }
            let newUser=await UserModel.createNew(newUserItem)

            return done(null,newUser,req.flash("success",transSuccess.loginSuccess(newUser.username)))

        } catch (error) {
            console.log(error)
        }
    }))

    //Save userId to session
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })

    passport.deserializeUser((id,done)=>{
        UserModel.findUserById(id)
            .then(user=>{
                return done(null,user)
            })
            .catch(error =>{
                return done(error,null)
            })
    })
}

module.exports=initPassportFacebook