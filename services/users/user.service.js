const {User} = require('../../models/User')
const IUserDTO = require('../../interfaces/IUser');
const authMailConfig = require('../../configs/nodemailer');
const _ = require('lodash');

const registerUser = (req, res)=>{

  const userInfo = new IUserDTO(req.body).getRegisterUserInfo();
  const user = new User(userInfo);

  user.save((err,userInfo)=>{
    if(err)
    {
      console.log(err);
      return res.status(500).json({
         register_success: false,
         err: "mongoDB error"
      })
    }

    authMailConfig(req, user);
    return res.status(200).json({
      register_success: true,
      register_auth : false
    });
  });
}


const checkDuplicateEmailName = (req, res)=>{
  if(!req.params.email){
    return res.status(400).json({
      check_email_id: false,
      err: "empty email object"
    });
  }

  User.findOne({email:req.params.email},(err,user)=>{
    if(err)
    {
      console.log(err);
      return res.status(500).json({
         check_email_id: false,
         err: "mongoDB error"
      })
    }

    if(!user){
      return res.status(200).json({
        check_email_id:true
      })
    }else {
      return res.status(200).json({
        check_email_id: false,
        err: "this email name is existed in DB"
      })
    }
  })
}

const checkVerifyAuthEmail = (req,res)=>{
	User.updateOne({auth_email_key:req.query.key},{$set:{auth_email_verified:true}}, function(err,user){
		if(err)
      console.log(err);
		else if(!user)
      res.status(400);
		else
      res.status(200).redirect('/');
	});
}

const loginUser = (req,res)=>{
  if(!req.body.email)
    return res.status(400).json({
      login_success : false,
      err: "요청 데이터 객체가 비어있습니다"
    });

  User.findOne({email:req.body.email},(err,user)=>{
    if(err){
      console.log(err);
      return res.status(500).json({login_success: false, err: "mongoDB error" });
    }

    if(!user)
      return res.status(400).json({
        login_success: false,
        err: "해당 유저를 찾을 수 없습니다."
      })

    if(user.delny === true)
      return res.status(400).json( {login_success: false, err: "해당 계정은 삭제되었습니다" });

    user.comparePassword(req.body.password, (err, isMatch)=>{
      if(!isMatch)
        return res.status(200).json({
          login_success: false,
          err: "매치 되는 비밀번호가 없습니다."
        });

      user.generateToken((err, user)=>{
        if(!user) return res.status(400).send({
          login_success: false,
          err: "토큰 생성에 실패했습니다."
        });

        res.cookie("x_pla", user.token)
          .status(200)
          .json({
            login_success: true,
            user_id: user._id
          });
      })
    });
  })
}

const sendIsAuth = (req,res)=>{
  const user = new IUserDTO(req.user).getAuthInfo();
  console.log('auth user info '+ user);

  res.status(200).json(user);
}

const uploadProfileImage = (req,res)=>{
  const updateInfo = new IUserDTO(req.body).getUploadImageInfo();

  if(!updateInfo._id || !updateInfo.profile_image)
    return res.status(400).json({
      upload_profileImage_success: false,
      err: "요청 데이터에 정보가 빈 데이터가 있습니다."
    })

  User.findOneAndUpdate({_id: updateInfo._id},{$set : { profile_image: updateInfo.profile_image, update_date : updateInfo.update_date }}, {new :true}, (err, updatedUser)=>{
    if(err)
    {
      console.log(err);
      return res.status(500).json({
         upload_profileImage_success: false,
         err: "mongoDB error"
      })
    }

    if(!updatedUser)
      return res.status(400).json({
        upload_profileImage_success : false,
        err : "요청한 계정정보에 해당하는 계정정보가 없습니다."
      })

    return res.status(200).json({
      upload_profileImage_success : true,
      err: err
    })
  })
}

const uploadProfileText = (req,res)=>{
  const updateInfo = new IUserDTO(req.body).getUploadTextInfo() ;

  if(!updateInfo._id || !updateInfo.profile_text)
    return res.status(400).json({
      upload_profileText_success: false,
      err: "요청 데이터에 정보가 빈 데이터가 있습니다."
    })

  User.findOneAndUpdate({_id: updateInfo._id},{$set : { profile_text: updateInfo.profile_text, update_date : updateInfo.update_date }}, {new :true}, (err, updatedUser)=>{
    // @desc duplicate update image
    if(err)
    {
      console.log(err);
      return res.status(500).json({
         upload_profileText_success: false,
         err: "mongoDB error"
      })
    }

    if(!updatedUser)
      return res.status(400).json({
        upload_profileText_success : false,
        err : "요청한 계정정보에 해당하는 계정정보가 없습니다."
      })

    return res.status(200).json({
      upload_profileText_success : true,
      err: err
    })
  })
}

const updateUserInfo = (req,res)=>{
  const updateInfo = new IUserDTO(req.body).getUpdateUserInfo() ;

  for (const prop in updateInfo){
    if(!updateInfo[prop])
      return res.status(400).json({
        update_user_success: false,
        err: "요청 데이터에 빈 객체가 존재합니다."
      })
  }

  let updateInputObj = _.cloneDeep(updateInfo);
  delete updateInputObj['_id'];

  User.findOneAndUpdate({_id: updateInfo._id},{$set : updateInputObj}, {new :true}, (err, updatedUser)=>{
    // @desc duplicate update image
    if(err)
    {
      console.log(err);
      return res.status(500).json({
         update_user_success: false,
         err: "mongoDB error"
      })
    }

    if(!updatedUser)
      return res.status(400).json({
        update_user_success : false,
        err : "요청한 계정정보에 해당하는 계정정보가 없습니다."
      })

    return res.status(200).json({
      update_user_success : true,
      err: err
    })
  })
}

const logoutUser = (req,res)=>{
  if(!req.cookies.x_pla){
    return res.status(400).json({
      logout_success : false,
      err: "필요 데이터 객체 정보가 없습니다."
    })
  }

  User.findOneAndUpdate({token : req.cookies.x_pla}, {$set : {token: ""}}, {new: true}, (err,updatedUser)=>{
    if(err)
    {
      console.log(err);
      return res.status(500).json({
         logout_success: false,
         err: "mongoDB error"
      })
    }

    if(!updatedUser)
      return res.status(400).json({
        logout_success: false,
        err: "토큰에 해당하는 유저가 없습니다."
      })

    return res.status(200).clearCookie('x_pla').json({
      logout_success: true,
      err: err
    })
  })
}

const confirmUserPassword = (req,res)=>{
  if(!req.body._id || !req.body.password)
    return res.status(400).json({
      confirm_password_success: false,
      err: "요청 데이터가 비어있습니다."
    })

  User.findById({_id: req.body._id}, (err,user)=>{
    if(err)
    {
      console.log(err);
      return res.status(500).json({
         confirm_password_success: false,
         err: "mongoDB error"
      })
    }
    if(!user)
      return res.status(400).json({
        confirm_password_success: false,
        err: "해당 id에 일치하는 유저 정보가 없습니다"
      })

    user.comparePassword(req.body.password, (err,isMatch)=>{
      if(!isMatch)
        return res.status(200).json({
          confirm_password_success: false,
          err: "검색된 유저의 비밀번호와 일치하지 않습니다."
        })

      return res.status(200).json({
        confirm_password_success: true,
        err: err
      })
    })
  })
}

const updateUserPassword = (req,res)=>{
  const update_info = new IUserDTO(req.body).getUpdateUserPasswordInfo();
  update_info.new_password = req.body.new_password;

  for (const prop in update_info){
    if(!update_info[prop])
      return res.status(400).json({
        update_password_success: false,
        err: "요청 데이터객체에 빈 데이터가 존재합니다."
      })
  }

  if(update_info.password === update_info.new_password)
    return res.status(400).json({
      update_password_success: false,
      err: "현재 비밀번호와 바꿀 비밀번호가 같은 비밀번호입니다."
    })

  User.findOne({_id: update_info._id}, (err,user)=>{
    user.comparePassword(update_info.password,(err,isMatch)=>{
      if(err){
        console.log(err);
        return res.status(500).json({
          update_password_success: false,
          err: "mongoDB error"
        })
      }
      if(!isMatch)
        return res.status(400).json({
          update_password_success: false,
          err: "해당 유저에 맞지 않는 현재 비밀번호를 입력했습니다."
        })

      user.updatePassword(update_info.new_password, update_info.update_date, (err,update_success)=>{
        if(err){
          console.log(err);
          return res.status(500).json({
            update_password_success: false,
            err: "mongoDB error"
          })
        }
        if(!update_success)
          return res.status(400).json({
            update_password_success: false,
            err: "업데이트된 유저 정보가 없습니다."
          })

        return res.status(200).json({
          update_password_success: true,
          err: err
        })
      })
    })
  })
}

const deleteUser = (req,res)=>{
  let delete_info = new IUserDTO(req.body).getDeleteUserInfo();

  if(!delete_info._id)
    return res.status(400).json({delete_user_success: false, err:"요청 데이터의 유저id가 비어있습니다."})

  User.findOneAndUpdate({_id:delete_info._id}, {$set : delete_info},{new:true},(err,deleted_user)=>{
    if(err){
      console.log(err);
      return res.status(500).json({delete_user_success: false, err:"mongoDB error"});
    }

    if(!deleted_user)
      return res.status(400).json({ delete_user_success: false, err:"삭제된 유저 정보가 없습니다."})

    return res.status(200).json({ delete_user_success: true, err:err});
  })
}

module.exports = {
  registerUser,
  checkDuplicateEmailName,
  checkVerifyAuthEmail,
  loginUser,
  logoutUser,
  sendIsAuth,
  uploadProfileImage,
  uploadProfileText,
  updateUserInfo,
  confirmUserPassword,
  updateUserPassword,
  deleteUser
}
