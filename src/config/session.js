import session from "express-session"
import connectMongo from "connect-mongo"

let MongoStore=connectMongo(session)
let DB_CONNECTION="mongodb";
let DB_HOST="localhost";
let DB_PORT="27017";
let DB_NAME="awesome_chat";
let DB_USERNAME="";
let DB_PASSWORD="";
let sessionStore=new MongoStore({
    url:`${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    autoConnect:true,
    // autoRemove:"native"
})

let config=(app)=>{
    app.use(session({
        key:"express.sid",
        secret:"mySecret",
        store:sessionStore,
        resave:true,
        saveUninitialized:false,
        cookie:{
            maxAge:1000*60*60*24
        }
    }))
}

module.exports = {
    config : config,
    sessionStore : sessionStore
}