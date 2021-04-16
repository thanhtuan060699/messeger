import nodeMailer from "nodemailer"

let MAIL_USER="nguyenthanhhlal123@gmail.com"
let MAIL_PASSWORD="nghia060699"
let MAIL_HOST ="smtp.gmail.com"
let MAIL_PORT = "587"

let sendMail=(to,subject,htmlContent) =>{
    let transporter=nodeMailer.createTransport({
        host:MAIL_HOST,
        port:MAIL_PORT,
        secure:false,
        auth:{
            user:MAIL_USER,
            pass:MAIL_PASSWORD
        }
    })

    let options={
        from:MAIL_USER,
        to: to,
        subject :subject,
        html : htmlContent
    }
    return transporter.sendMail(options) // This default return a promise
}

module.exports=sendMail