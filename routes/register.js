var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var settings = require('../config/database');
var nodemailer = require('nodemailer');
var mail = require('../model/mail.js');
var random;
var user = require('../model/tbluser.js');

module.exports = function(app) {

//====================================================== register ============================

app.post('/register',function(req,res,next){
  if(req.body.email == "" || req.body.mobile == "" || req.body.password == "" || req.body.email == undefined || req.body.password == undefined || req.body.mobile == undefined)
  {
    res.json({status: '0', msg : 'please fill data'});
  }
  else
  {
              random = Math.floor(100000 + Math.random() * 900000);
              user.registerNew(req.body.fname, req.body.lname, req.body.email, req.body.mobile, req.body.password, random, function (err, data) {
            	    if (err)
            			{
            						res.json({status: '0', msg: ''});
            	    }
                  else if(data == false)
            			{
                        res.json({status: '0', msg : 'email is already exist'});
            			}
            			else
            			{
                          mail.sendEmail(req.body.email,random, function(err,data){
                                  if (err)
                                  {
                                      res.json({status: '1',msg: 'error in sending mail'});
                                  }
                                  else
                                  {
                                        res.json({status: '1',msg: 'Your Account has been created'});
                                  }
                          });
            			  }
            	});
      }
});

//================================================== signin =============================

app.post('/signin', function (req, res) {
  var path = "192.168.200.68:8000";
	//TODO validate req.body.username and req.body.password
	//if is invalid, return 401
	if(req.body.email == "" || req.body.password == "" || req.body.email == undefined || req.body.password == undefined)
	{
		res.json({status: '0', msg : 'please fill data'});
	}
	else {
							user.signin(req.body.email, req.body.password, function (err, data) {
									if (err)
									{
												res.json({status: '0', msg:'error in signin'});
									}
									else if(data == false)
									{
												res.json({status: '0', msg : 'wrong username or password'});
									}
									else
									{
													var profile = {
																id: data[0].userId
													};

													// We are sending the profile inside the token
													var token = jwt.sign(profile, settings.JWTPrivateKey, { expiresIn: settings.expiresIn });
                          var emailverified = data[0].isEmailVerified.toString();
                          var p_path = data[0].userProfile;
                          var i_path = p_path.substring(6);
                          var profile = path.concat(i_path);
													res.json({ token: token , status: '1', msg:'successfully signin', firstName: data[0].firstName, lastName: data[0].lastName, email: data[0].email, mobile: data[0].mobile, isEmailVerified: emailverified, userProfile: profile});
									}
							});
				}
});
}
