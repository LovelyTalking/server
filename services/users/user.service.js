const {User} = require('../../models/User')
const IUserDTO = require('../../interfaces/IUser');
const { AuthContainer } = require('../../containers/auth/auth')
//@desc TODO: After import EventEmitter , use event for service class


const registerUser = (req, res)=>{

  const userInfo = new IUserDTO(req.body).getRegisterUserInfo;
  const user = new User(userInfo);

  user.save((err,userInfo)=>{
    if(err) return res.json({success: false, err});

    require('../../configs/nodemailer')(req, user);
    return res.status(200).json({
      success: true,
      register_auth : false
    });
  });
}


const checkDuplicateEmailName = (req, res)=>{
  if(!req.params.email){
    return res.json({
      check_email_id: false,
      err: "empty email object"
    });
  }
  User.findOne({email:req.params.email},(err,user)=>{
    if(!user){
      return res.json({
        check_email_id:true
      })
    }else {
      return res.json({
        check_email_id: false,
        err: "this email name is existed in DB"
      })
    }
  })
}


const checkVerifyAuthEmail = (req,res)=>{
	User.updateOne({auth_email_key:req.query.key},{$set:{auth_email_verified:true}}, function(err,user){
		if(err) console.log(err);
		else if(!user) res.json({ verify_success: false , err: "no matched user" });
		else res.json({ verify_success: true });
	});
}

const loginUser = (req,res)=>{
  User.findOne({email:req.body.email},(err,user)=>{
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    user.comparePassword(req.body.password, (err, isMatch)=>{
      if(!isMatch)
        return res.json({
          loginSuccess: false, message: "비밀번호가 틀렸습니다."
        });

      user.generateToken((err, user)=>{
        if(err) return res.status(400).send(err);

        res.cookie("x_pla", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id});
      })
    });
  })
}

const sendIsAuth = (req,res)=>{
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    profile_image: req.user.profile_image,
    profile_text: req.profile_text,
    native_language: req.native_language,
    target_language: req.target_language,
    post_count: req.post_count,
    badges: req.badges
  })
}

module.exports = {
  registerUser, checkDuplicateEmailName, checkVerifyAuthEmail, loginUser, sendIsAuth
}
