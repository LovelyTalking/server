const {User} = require("../../models/User");
const AuthContainer = require('typedi').Container;
const {ErrorContainer} = require('../../containers/errors/message.error');

const CustomError = ErrorContainer.get('custom.error');

let authUser = async (req, res, next)=>{
  try{
    let token = req.cookies.x_pla;
    const verified_user = await User.findVerifiedUser(token);
    if(verified_user.err) throw new CustomError(500,"인증된 유저를 찾는데서 에러");
    if(!verified_user.user) throw new CustomError(400,"매치되는 유저가 없습니다");

    req.token = token;
    req.user = verified_user.user;

    next();
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send("");
    else return res.status(500).send("");
  }
}

AuthContainer.set("auth.User", authUser);


module.exports = { AuthContainer };
