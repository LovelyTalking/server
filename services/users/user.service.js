const {User} = require('../../models/User')
const IUserDTO = require('../../interfaces/IUser');
//@desc TODO: After import EventEmitter , use event for service class
const EventEmitter = require('events').EventEmitter;
const eventEmitter = new EventEmitter();

export class UserService {
  signup(req, res){
    return eventEmitter.emit('user_signup',req, res);
  }

}

// @desc TODO: 지금 이벤트를 활용한 회원가입 유저를 실시해본다
eventEmitter.on('user_signup',(req,res)=>{
  const userInfo = new IUserDTO(req.body).getRegisterUserInfo;
  const user = new User(userInfo);

  user.save((err,userInfo)=>{
    if(err) return res.status(400).json({success: false, err});

    require('../../configs/nodemailer')(req, user);
    return res.status(200).json({
      success: true,
      register_auth : false
    });
  });
})

const registerUser = (req, res)=>{

  const userInfo = new IUserDTO(req.body).getRegisterUserInfo;
  const user = new User(userInfo);

  user.save((err,userInfo)=>{
    if(err) return res.status(400).json({success: false, err});

    require('../../configs/nodemailer')(req, user);
    return res.status(200).json({
      success: true,
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

  userInfo = new IUserDTO(req.params);
  User.findOne({email:userInfo.email},(err,user)=>{
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
		if(err) console.log(err);
		else if(!user) res.status(400).json({ verify_success: false , err: "no matched user" });
		else res.status(200).json({ verify_success: true });
	});
}

const loginUser = (req,res)=>{

  User.findOne({email:req.body.email},(err,user)=>{
    if(!user){
      return res.status(400).json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    user.comparePassword(req.body.password, (err, isMatch)=>{
      if(!isMatch)
        return res.status(200).json({
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
