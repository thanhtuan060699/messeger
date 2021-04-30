import mongoose from "mongoose";
import bluebird from 'bluebird'
let connectDB=()=>{
    mongoose.Promise=bluebird;
    let DB_CONNECTION="mongodb+srv";
    let DB_HOST="root";
    let DB_PORT="root@12345!@cluster0.y9j7a.mongodb.net";
    let DB_NAME="message";
    let DB_USERNAME="";
    let DB_PASSWORD="";

    const URI = "mongodb+srv://root:root@12345!@cluster0.y9j7a.mongodb.net/message?retryWrites=true&w=majority";

    //let URI=`${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}?retryWrites=true&w=majority`;

    return mongoose.connect(URI,{useNewUrlParser: true });

};

module.exports=connectDB;