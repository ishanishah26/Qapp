var multer=require('multer');
var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var settings = require('./../config/database');
var mail = require('../model/mail.js');
var random;
var user = require('../model/tbluser.js');

//============================================ change email ==========================

router.put('/changeemail',function(req,res,next){

  if(req.body.newEmail == "" || req.body.newEmail == undefined )
	{
		res.json({status: '0', msg : 'please enter new email'});
	}
  else
  {
          random = Math.floor(100000 + Math.random() * 900000);
          var session = res.locals.session;
          user.changeEmail(session.id, req.body.newEmail, random, function (err, data) {
              	    if (err)
              			{
              					res.json({status: '0', msg:'error in change mail'});
              	    }
                    else if(data == false)
                    {
                          res.json({status: '0', msg : 'wrong tokan'});
                    }
              			else
              			{
                            mail.sendEmail(req.body.newEmail,random, function(err,data){
                                    if (err)
                                    {
                                        res.json({status: '1', msg:'error in sending mail'});
                                    }
                                    else
                                    {
                                          res.json({status: '1', msg : 'otp is send to new email'});
                                    }
                            });
                	}
        	});
   }
});

//============================================ verifyPassccode =================================

router.post('/passcode',function(req,res,next){
  var session = res.locals.session;
  user.verifyPassccode(session.id, req.body.passcode, function (err, data) {
	    if (err)
			{
						res.json({status: '0', msg:'error'});
	    }
      else if(data == false)
      {
            res.json({status: '0', msg : 'wrong passcode'});
      }
			else
			{
				    res.json({status: '1', msg:'successfully done'});
			}
	});
});

//========================================== resend =============================================

  router.get('/resend',function(req,res,next) {
    var session = res.locals.session;
    user.getEmail(session.id, function (err, data) {
  	    if (err)
  			{
  						res.json({status: '0', msg:'error'});
  	    }
        else if(data == false)
        {
              res.json({status: '0', msg : 'wrong '});
        }
  			else
  			{
				  var email = data[0].email;
                  random = Math.floor(100000 + Math.random() * 900000);
                  user.resendPasscode(session.id, random, function (err, data) {
                	    if (err)
                			{
                						res.json({status: '0', msg:'error'});
                	    }
                      else if(data == false)
                      {
                            res.json({status: '0', msg : 'wrong '});
                      }
                			else
                			{
                                mail.sendEmail(email,random, function(err,data){
                                        if (err)
                                        {
                                            res.json({status: '1', msg:'error in sending mail'});
                                        }
                                        else
                                        {
                                              res.json({status: '1', msg : 'otp is resend successfully'});
                                        }
                                });
                          }
          			    });
          }
  	});
});

//================================================== Qrequest ====================================

router.post('/qRequest',function(req,res,next) {
        var session = res.locals.session;
        if(req.body.isTranport == 0)
        {
          var date = req.body.requiredDate;
          var train_date = date.split("-");
          var requiredDate = train_date[2] +"-"+train_date[1]+"-"+train_date[0];
                    user.qRequestElse(session.id,req.body.curLat,req.body.curLong,req.body.verb,req.body.noun,req.body.time,req.body.price,req.body.isRequireNow,requiredDate,function(err,data){
                                if (err)
                                {
                                      res.json({status: '0', msg:'error'});
                                }
                                else
                                {
                                      res.json({status: '1', msg:'request done successfully'});
                                }
                    });
        }
        else
        {
                user.qRequestTranport(session.id,req.body.curLat,req.body.curLong,req.body.verb,req.body.noun,req.body.time,req.body.price,req.body.numOfStop,req.body.stops,function(err,data){
                          if (err)
                          {
                                res.json({status: '0', msg:'error'});
                          }
                          else
                          {
                                res.json({status: '1', msg:'request done successfully'});
                          }
                });
        }
});

//================================================== edit profile ==============================

router.put('/profilepic',multer({ dest: './public/images/'}).single('image'),function (req,res,next) {
    var path = "192.168.200.68:8000";
    var session = res.locals.session;
    if(req.file == "" || req.file == undefined )
  	{
  		res.json({status: '0', msg : 'please fill data'});
  	}
  	else
    {
            user.profilepic(session.id,req.file.path,function(err,data){
                    if(err)
                    {
                        res.json({status: '0', msg:'error uploading image'});
                    }
                    else
                    {
                      var p_path = req.file.path;
                      var i_path = p_path.substring(6);
                      var profile = path.concat(i_path);
                        res.json({status: '1', msg:'Image Successfully uploaded', image: profile});
                    }
            });
    }
});

//=============================================== delete Account ============================

router.get('/userDelete',function(req,res,next) {
        var session = res.locals.session;
        user.deleteAccount(session.id,function(err,data){
                  if (err)
                  {
                        res.json({status: '0', msg:'error'});
                  }
                  else
                  {
                        res.json({status: '1', msg:'Your Accoount deleted successfully'});
                  }
        });
});

//================================================== qProvider ===============================

router.post('/qProvider',function(req,res,next) {
        var session = res.locals.session;
        user.qProviderRequest(session.id,req.body.curLat,req.body.curLong,req.body.fname,req.body.lname,req.body.email,req.body.zipCode,req.body.mobile,function(err,data){
                  if (err)
                  {
                        res.json({status: '0', msg:'error'});
                  }
                  else
                  {
                        res.json({status: '1', msg:'provide account created successfully'});
                  }
        });
});

//========================================== report issue ========================================

router.post('/reportIssue',function(req,res,next){
       var session=res.locals.session;
       if(req.body.issue == "" || req.body.issue == undefined )
       {
              res.json({status: '0', msg : 'please fill data'});
       }
       else
       {
             user.reportIssue(session.id,req.body.issue,function(err,data){
                     if(err)
                     {
                        res.json({status:'0',msg:'error in reporting issue'});
                     }
                     else
                     {
                        res.json({status:'1', msg:'Issue submitted'});
                     }
             });
       }
});

//======================================= request history =====================================

router.get('/requestHistory',function(req,res,next){
       var session=res.locals.session;
             user.requestHistory(session.id,function(err,data){
                     if(err)
                     {
                        res.json({status:'0',msg:'error in reporting issue'});
                     }
                     else
                     {
                           for(var i = 0; i < data.length; i++)
                           {
                              var date = data[i].createdDate + "";
                              var train_date = date.split(" ");
                              data[i].createdDate = train_date[2] + " " + train_date[1] + " " + train_date[3];
                              console.log(data[i].createdDate);
                           }
                            res.json({status:'1', msg:'Get your History', history: data});
                     }
             });
});

//================================================== qProvider ===============================

router.post('/qProviderLigal',function(req,res,next) {
        var session = res.locals.session;
        user.qProviderRequestThird(session.id,req.body.lFname,req.body.lMname,req.body.lLname,req.body.securityNum,
          req.body.dob,req.body.dlNum,req.body.state,req.body.dlExpiration,req.body.hsName,req.body.hsCity,
          req.body.hsState,req.body.hsYear,req.body.clgInfo,req.body.yearoProfExp,req.body.yearoProfAssiExp,
          req.body.qRole,function(err,data){
                  if (err)
                  {
                        res.json({status: '0', msg:'error'});
                  }
                  else
                  {
                        res.json({status: '1', msg:'provide account created successfully'});
                  }
        });
});

module.exports = router;
