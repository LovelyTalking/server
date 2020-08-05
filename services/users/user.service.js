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

    authmailConfig(req, user);
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
  if(!req.body)
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
          err: err
        });

      user.generateToken((err, user)=>{
        if(err) return res.status(400).send({
          login_success: false,
          err: err
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
  res.status(200).json({
    _id: req.user._id,
    //isAdmin: req.user.role === 0? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    profile_image: req.user.profile_image,
    profile_text: req.user.profile_text,
    native_language: req.user.native_language,
    target_language: req.user.target_language,
    post_count: req.user.post_count,
    badges: req.user.badges
  })
}

module.exports = {
  registerUser, checkDuplicateEmailName, checkVerifyAuthEmail, loginUser, sendIsAuth
}
