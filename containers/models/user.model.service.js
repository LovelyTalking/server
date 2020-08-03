const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const cryptPassword = function(next){
  let user = this;
  console.log(user);
  if(user.isModified('password')){

    bcrypt.genSalt(saltRounds, (err,salt)=>{
      if(err) return next(err);
      //console.log(1);
      bcrypt.hash(user.password, salt, (err, hash) =>{
        if(err) return next(err);
        user.password = hash;
      })

      bcrypt.hash(user.email, salt, (err,hash)=>{
        if(err) return next(err);
        user.auth_email_key = hash;
        next();
      })
    })
  }else{
    next();
  }
};


const comparePassword = function(plainPass, cb){
  bcrypt.compare(plainPass, this.password, (err, isMatch)=>{
    if(err) return cb(err);
    cn(null, isMatch);
  })
}


const generateToken = function(cb){
  let user = this;
  let token = jwt.sign(user._id.toHexString(), 'secretToken');

  user.token = token;
  user.save((err,user)=>{
      if(err) return cb(err);
      cn(null, user);
  })
}


const findByToken = function(token, cb){
  const user= this;

  jwt.verify(token, 'secretToken', (err,decoded)=>{
    user.findOne({"_id" :decoded, "token": token}, (err,user)=>{
      if(err) return cb(err);
      cb(null, user);
    })
  })
}


const findVerifiedUser = function(token, cb){
  const user= this;

  jwt.verify(token, 'secretToken', (err,decoded)=>{
    user.findOne({"_id" :decoded, "token": token, "auth_email_verified":true}, (err,user)=>{
      if(err) return cb(err);
      cb(null, user);
    })
  })
}

module.exports = {
  cryptPassword, comparePassword, generateToken, findByToken, findVerifiedUser
}
