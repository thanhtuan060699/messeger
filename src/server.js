import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRouters from "./routers/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import session from "./config/session";
import passport from "passport";
import http from "http";
import socketio from "socket.io";
import initSocket from "./sockets/index";

import events from "events";
import passportSocketIo from "passport.socketio";
import cookieParser from "cookie-parser";
import pem from "pem"
import https from "https"

  
let app=express();

//set max connection event listener
events.EventEmitter.defaultMaxListeners = 30;

//init server with socket io & express app

let server=http.createServer(app)
let io=socketio(server)

   
ConnectDB()

//config session
session.config(app)


configViewEngine(app);

app.use(bodyParser.urlencoded({extended:true}))

   
app.use(connectFlash())

//use cookie parser
app.use(cookieParser())

   
app.use(passport.initialize())

app.use(passport.session())

  
initRouters(app)

io.use(passportSocketIo.authorize({
    cookieParser : cookieParser,
    key:"express.sid",
    secret:"mySecret",
    store : session.sessionStore,
    success : (data,accept) =>{
        if(!data.user.logged_in){
            return accept("Invalid user",false)
        }
        return accept(null,true)
    },
    fail : (data,message,error,accept)=>{
        if(error){
            console.log("Failed connection socket i.o",message)
            return accept(new Error(message),false)
        }
    }
}))
//init all socket
initSocket(io)

let hostname="localhost"

let port=8017

server.listen(port,hostname,()=>{
    console.log('Hello Tuan !!! Im running ')
})