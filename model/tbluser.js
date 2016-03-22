var mysql = require('mysql');
var connection = require('../config/database');
var connect = mysql.createConnection(connection.dbconfig);
//===================================== connection ===============================

	connect.connect(function(err){
	if(!err)
	console.log("done connection");
	else
	console.log("error in connection");
	});

//===================================== new register ==============================

  exports.registerNew  = function(fname,lname,email,mobile,password,random,callback) {
		var image = "public/static_image/user-icon.png"
							connect.query('CALL user_register("'+ email +'","'+ mobile +'","'+ password +'","'+ random +'","'+ fname +'","'+ lname +'","'+ image +'")',function(err, data){
		                  if(!err)
		                  {
														if(data[0][0].msg == 'insert')
														{
																callback(null, data);
														}
														else
														{
																	callback(null, false);
														}
		                  }
		                  else
		                  {
		                    callback(err,null);
		                  }
		          });
  }

// ============================================ Signin ==================================

	exports.signin  = function(email,password,callback) {

					connect.query('select userId,firstName,lastName,email,mobile,isEmailVerified,userProfile from user where email="'+ email +'"and password="'+ password +'"',function(err, data){
									if(!err)
									{
													if(data.length > 0)
													{
															callback(null, data);
													}
													else
													{
																callback(null, false);
													}

									}
									else
									{
										callback(err,null);
									}
					});
	}


	//======================================== Change email ===============================

		exports.changeEmail  = function(id,email,random,callback) {
								connect.query('UPDATE user SET email="'+ email +'", passcode="'+ random +'" WHERE userId = "'+ id +'"',function(err, data){
			                  if(!err)
			                  {
																	if(data.affectedRows > 0)
																	{
																			callback(null, data);
																	}
																	else
																	{
																				callback(null, false);
																	}
			                  }
			                  else
			                  {
			                    callback(err,null);
			                  }
			          });
	  }

// ============================================ verify passcode ==================================

	exports.verifyPassccode  = function(id,passcode,callback) {
					connect.query('UPDATE user SET isEmailVerified = "1" where userId="'+ id +'" and passcode="'+ passcode +'"',function(err, data){
									if(!err)
									{
													if(data.affectedRows > 0)
													{
															callback(null, data);
													}
													else
													{
																callback(null, false);
													}
									}
									else
									{
										callback(err,null);
									}
					});
	}

	//======================================== resend Passcode ===============================

		exports.resendPasscode  = function(id,random,callback) {
								connect.query('UPDATE user SET passcode="'+ random +'" WHERE userId = "'+ id +'"',function(err, data){
			                  if(!err)
			                  {
																if(data.affectedRows > 0)
																{
																		callback(null, data);
																}
																else
																{
																			callback(null, false);
																}
			                  }
			                  else
			                  {
			                    callback(err,null);
			                  }
			          });
	  }

 //=================================== get email for resend passcode =====================

			exports.getEmail  = function(id,callback) {

							connect.query('select email from user where userId="'+ id +'"',function(err, data){
											if(!err)
											{

															if(data.length > 0)
															{
																	callback(null, data);
															}
															else
															{
																		callback(null, false);
															}

											}
											else
											{
												callback(err,null);
											}
							});
			}

// ============================================ Qrequest Any thing else ==================================

	exports.qRequestElse  = function(id,curLat,curLong,verb,noun,time,price,isRequireNow,requiredDate,callback) {
				connect.query('insert into qRequest(qRequestId,userId,currentLat,currentLong,requestVerb,requestNoun,qRequiredTime_Hr,qRequiredPayment,isRequiredNow,qRequiredDate,requestStatus,createdDate) values(UUID(),"'+ id +'","'+ curLat +'","'+ curLong +'","'+ verb +'","'+ noun +'","'+ time +'","'+ price +'","'+ isRequireNow +'","'+ requiredDate +'","submitted",now())',function(err, data){
						if(!err)
						{
							console.log(data);
								callback(null, data);
						}
						else
						{
							console.log(err);
									callback(err,null);
   					}
		});
 }

// ============================================ Qrequest Transport ==================================

		exports.qRequestTranport  = function(id,curLat,curLong,verb,noun,time,price,nStops,stops,callback) {
			var id;
				connect.query('CALL qRequest("'+ id +'","'+ curLat +'","'+ curLong +'","'+ verb +'","'+ noun +'","'+ time +'","'+ price +'","'+ nStops +'")',function(err, data){
							if(!err)
							{
													id = data[0][0].r_id;
													for(var i = 0; i < stops.length; i++)
													{
																connect.query('insert into stopdetail(StopDetailId,QRequestId,StopLat,StopLong) values(UUID(),"'+ id +'","'+ stops[i].lat +'","'+ stops[i].long +'")',function(err, next){
																						if(err)
																						{
																							  callback(err,null);
																						}
																	});
													}
													callback(null,data);
							}
							else
							{
													callback(err,null);
							}
				});
		}

//=============================================== edit profile pic ====================================

exports.profilepic = function(userId,image,callback) {
			connect.query('update user set userProfile="'+image+'" where userId="'+userId+'"',function(err, data){
							if(!err)
								{
										callback(null,data);
								}
								else {
										callback(err,null);
								}
			});
	}

//================================================ Delete Account ======================================

exports.deleteAccount = function(id,callback) {
			connect.query('delete from  user  where userId="'+ id +'"',function(err, data){
							if(!err)
								{
										callback(null,data);
								}
								else {
										callback(err,null);
								}
			});
	}

// ============================================ Qprovider ==============================================
var qId;
exports.qProviderRequest  = function(id,curLat,curLong,fname,lname,email,zipCode,mobile,callback) {
					connect.query('CALL insert_qProvider("'+ id +'","'+ curLat +'","'+ curLong +'","'+ fname +'","'+ lname +'","'+ email +'","'+ zipCode +'","'+ mobile +'")',function(err, data){
								if(!err)
								{
													if(data[0][0].msg == 'exists')
													{
															callback(null, false);
													}
													else
													{
															qId = data[0][0].r_id;
															callback(null, data);
													}
								}
								else
								{
														callback(err,null);
								}
					});
			}

//========================================== report an issue ==========================================

exports.reportIssue = function(id,issue,callback) {
    connect.query('insert into reportIssue(issueDetail,userId) values("'+ issue +'","'+ id +'")',function(err,data) {
        if(!err)
        {
            callback(null,data);
        }
        else
				{
            callback(err,null);
        }
    });
}

//========================================== report an issue ==========================================

exports.requestHistory = function(id,callback) {
    connect.query('select requestVerb,requestNoun,createdDate from qRequest where userId = "'+ id +'" and requestStatus = "submitted"',function(err,data) {
        if(!err)
        {
					console.log(data);
            callback(null,data);
        }
        else {
            callback(err,null);
        }
    });
}

//======================================== Qprovide step 3 ===============================

	// exports.qProviderRequestThird  = function(id,lFname,lMname,lLname,securityNum,dob,dlNum,state,dlExpiration,hsName,hsCity,hsState,hsYear,clgInfo,yearoProfExp,yearoProfAssiExp,qRole,callback) {
	// 						var name = lFname + " " + lMname + " " + lLname;
	// 						connect.query('UPDATE qProvider SET nameOnDL="'+ name +'", socialSecurityNo = "'+ securityNum +'", dateOfBirth = "'+ dob +'",
	// 						dlNo = "'+ dlNum +'",dlState = "'+ state +'",dateOfDlExpiration = "'+ dlExpiration +'",highSchoolName = "'+ hsName +'",
	// 						highSchoolCity = "'+ hsCity +'",highSchoolState = "'+ hsState +'",highSchoolYOGrad = "'+ hsYear +'",collegeInfo = "'+ clgInfo +'",
	// 						totalYearOfProfExp = "'+ yearoProfExp +'",personalAssistantExp = "'+ yearoProfAssiExp +'",roleOfQ = "'+ qRole +'",isStateDisclouserAcknowledged = "1",
	// 						isBackgroundCheckAuthorized = "1",isQVerified = "1" WHERE userId = "'+ id +'" and qId = "'+ qId +'"',function(err, data){
	// 										if(!err)
	// 										{
	// 														if(data.affectedRows > 0)
	// 														{
	// 																callback(null, data);
	// 														}
	// 														else
	// 														{
	// 																	callback(null, false);
	// 														}
	// 										}
	// 										else
	// 										{
	// 											callback(err,null);
	// 										}
	// 						});
	// }
