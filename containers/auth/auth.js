const {User} = require("../../models/User");
const AuthContainer = require('typedi').Container;


let authUser = (req, res, next)=>{

  let token = req.cookies.x_pla;

  User.findVerifiedUser(token, (err, user)=>{
    if(err) throw err;
    if(!user) return res.json({ auth_succes :false, err: "매치되는 유저가 없습니다"});

    req.token = token;
    req.user = user;
    next();
  })
}

AuthContainer.set("auth.User", authUser);


module.exports = { AuthContainer };
