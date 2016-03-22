var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "lanetteam.jinal@gmail.com",
        pass: "lanetteam1"
      }
    });
exports.sendEmail  = function(email,random,callback) {
          transporter.sendMail({
                host : "localhost",
                port : "25",
                domain : "localhost",
                to : email,
                from : "lanetteam.jinal@gmail.com",
                subject : "node_mailer test email",
                html:"<h1>Qapp</h1><br><h3>Hii, This is your verification code with this you can signin</h3>" + random + "<h3>Thank you</h3>"
              },
              function(err, data){
                if(err)
                {
                      callback(err,null);
                 }
                else
                {
                      callback(null, data);
                }
              });
}
