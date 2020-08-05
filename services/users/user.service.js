const {User} = require('../../models/User')
const IUserDTO = require('../../interfaces/IUser');
const authMailConfig = require('../../configs/nodemailer');

const registerUser = (req, res)=>{

  const userInfo = new IUserDTO(req.body).getRegisterUserInfo();
  const user = new User(userInfo);

  user.save((err,userInfo)=>{
    console.log(userInfo);
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

module.exports = {
  registerUser, checkDuplicateEmailName, checkVerifyAuthEmail, loginUser, sendIsAuth
}
