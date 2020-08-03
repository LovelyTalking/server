const {User} = require("../../models/User");
const AuthContainer = require('typedi').Container;


let authUser = (req, res, next)=>{

  let token = req.cookies.x_pla;

  User.findVerifiedUser(token, (err, user)=>{
    if(err) throw err;
    if(!user) return res.json({ isAuth:false, err:"invalid Token or already not check auth email"});

    req.token = token;
    req.user = user;
    next();
  })
}

AuthContainer.set("auth.User", authUser);


module.exports = { AuthContainer };
