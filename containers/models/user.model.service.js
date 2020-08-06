const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const IUserDTO = require('../../interfaces/IUser')

const cryptPassword = function(next){
  let user = new IUserDTO(this).UserInfo;

  if(user.isModified('password')){
    bcrypt.genSalt(saltRounds, (err,salt)=>{
      if(err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) =>{
        if(err) return next(err);
        user.password = hash;

        cryptEmail(user, salt, next);
      })
    })
  }else{
    next();
  }
};

const cryptEmail = function(user, salt, next){
  bcrypt.hash(user.email, salt, (err,hash)=>{
    if(err) return next(err);
    user.auth_email_key = hash;
      next();
  })
}

const comparePassword = function(plainPass, cb){
  bcrypt.compare(plainPass, this.password, (err, isMatch)=>{
    if(err) return cb(err);
    cb(null, isMatch);
  })
}


const generateToken = function(cb){
  let user = new IUserDTO(this).UserInfo;
  let token = jwt.sign(user._id.toHexString(), 'secretToken');

  user.token = token;
  user.save((err,user)=>{
      if(err) return cb(err);
      cb(null, user);
  })
}


const findByToken = function(token, cb){
  let user = new IUserDTO(this).UserInfo;

  jwt.verify(token, 'secretToken', (err,decoded)=>{
    user.findOne({"_id" :decoded, "token": token}, (err,user)=>{
      if(err) return cb(err);
      cb(null, user);
    })
  })
}


const findVerifiedUser = function(token, cb){
  let user = new IUserDTO(this).UserInfo;

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
