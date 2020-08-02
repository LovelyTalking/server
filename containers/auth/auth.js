const {User} = require("../../models/User");
let authToken = (req, res, next)=>{

  let token = req.cookies.x_pla;

  User.findByToken(token, (err, user)=>{
    if(err) throw err;
    if(!user) return res.json({ isAuth:false, error: true});

    req.token = token;
    req.user = user;

    next();
  })
}

l

module.exports = { auth };
