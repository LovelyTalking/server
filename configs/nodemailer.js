const nodemailer = require('nodemailer');
const smtpTransporter = require('nodemailer-smtp-transport');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: __dirname+"../.env"});

const authMailConfig = function(req, user){
  const host_email = process.env.HOST_EMAIL;
  const password = process.env.HOST_EMAIL_PASSWORD;

  const smtpTransport = nodemailer.createTransport(smtpTransporter({
  	sevice : 'Gamil',
  	host : 'smtp.gmail.com',
  	auth : {
  		user: host_email,
  		pass: password
  	}
  }));

  const url ='http://'+req.get('host') + '/users/confirmEmail'+ '?key='+user.auth_email_key;

  const mailOpt = {
    from: process.env.HOST_EMAIL,
    to : user.email,
    subject : 'verify your email in PLaCon! ',
    html : '<h1> this is verify email from PlaCon, you must click link for playing in PLaCon.</h1><br> <a href="' + url +'"> please click here! </a>'
  };

  smtpTransport.sendMail(mailOpt, function(error,res){
    if(error) console.log(error);
    else console.log('email has been sent.');

    smtpTransport.close();
  })
}
module.exports = authMailConfig;
