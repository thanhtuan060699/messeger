import session from "express-session"
import connectMongo from "connect-mongo"

let MongoStore=connectMongo(session)
let DB_CONNECTION="mongodb+srv";
let DB_HOST="root";
let DB_PORT="root@12345!@cluster0.y9j7a.mongodb.net";
let DB_NAME="message";
let DB_USERNAME="";
let DB_PASSWORD="";
let sessionStore=new MongoStore({
    url: "mongodb+srv://root:aPPPHXkPTWetoE6k@cluster0-shard-00-00.y9j7a.mongodb.net:27017/message?ssl=true&replicaSet=atlas-v7mhqe-shard-0&authSource=admin&retryWrites=true&w=majority",
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