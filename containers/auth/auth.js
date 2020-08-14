const {User} = require("../../models/User");
const AuthContainer = require('typedi').Container;
const {ErrorMessageContainer} = require('../errors/message.error');

const sendMongooseErr = ErrorMessageContainer.get('mongoDB.error');

let authUser = (req, res, next)=>{

  let token = req.cookies.x_pla;

  User.findVerifiedUser(token, (err, user)=>{
    if(err){
      sendMongooseErr(err, res);
    }

    if(!user) return res.status(400).json({ auth_succes :false, err: "매치되는 유저가 없습니다"});

    req.token = token;
    req.user = user;
    next();
  })
}

AuthContainer.set("auth.User", authUser);


module.exports = { AuthContainer };
