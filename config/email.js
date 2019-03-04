var nodemailer = require("nodemailer");
var ejs=require('ejs')
var module_keys=require('./keys.js')
var path=require('path')

var transporter = nodemailer.createTransport({
     host: 'smtp.gmail.com',
     port: 465,
    //service: 'gmail',
   

    secure: true, // use SSL
    auth: {
        user: module_keys.from_email,
        pass: module_keys.email_password
    }
});

var sendemail=function(user){

    ejs.renderFile(path.join(__dirname ,'../template/email_msg.ejs'), { name: user.name}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mainOptions = {
                from:module_keys.from_email,
                to: user.email,
                subject: 'Hello',
                html: data
            };
            console.log("html data ======================>", mainOptions.html);
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }
        
        });
}

module.exports={
    sendemail
}