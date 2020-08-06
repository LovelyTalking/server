const {User} = require('../../models/User')
const IUserDTO = require('../../interfaces/IUser');
const authMailConfig = require('../../configs/nodemailer');
const _ = require('lodash');

const registerUser = (req, res)=>{

  const userInfo = new IUserDTO(req.body).getRegisterUserInfo();
  const user = new User(userInfo);

  user.save((err,userInfo)=>{
    //console.log(userInfo);
    if(err)
      return res.status(400).json({register_success: false, err});

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
    if(!user){
      return res.status(400).json({
        login_success: false,
        err: err
      })
    }

    user.comparePassword(req.body.password, (err, isMatch)=>{
      if(!isMatch)
        return res.status(200).json({
          login_success: false,
          err: "매치 되는 비밀번호가 없습니다."
        });

      user.generateToken((err, user)=>{
        if(err) return res.status(400).send({
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
      return res.status(400).json({
        upload_profileImage_success : false,
        err : err
      });

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
      return res.status(400).json({
        upload_profileText_success : false,
        err : err
      });

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
      return res.status(400).json({
        update_user_success : false,
        err : err
      });

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

module.exports = {
  registerUser, checkDuplicateEmailName, checkVerifyAuthEmail, loginUser, sendIsAuth, uploadProfileImage, uploadProfileText, updateUserInfo
}
