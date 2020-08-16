const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const {IUserDTO} = require('../../interfaces/IUser')
const UserModelContainer = require('typedi').Container;
const {ErrorMessageContainer} = require('../errors/message.error');

const sendMongooseErr = ErrorMessageContainer.get('mongoDB.error')

const cryptPasswordAndEmail = function(next){
  let user = this;

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

const updatePassword = function(new_password,update_date, cb){
  let user = this;
  bcrypt.genSalt(saltRounds, (err,salt)=>{
    if(err) return cb(err);

    bcrypt.hash(new_password, salt, (err, hash)=>{
      if(err) return cb(err);
      user.update({$set: {password:hash, update_date: update_date }},{new: true,runValidators:true}, (err,updated_user)=>{
        if(err) cb(err);
        if(!updated_user) cb(null, false);
        cb(null,true);
      })
    })
  })

};

const comparePassword = function(plainPass, cb){
  bcrypt.compare(plainPass, this.password, (err, isMatch)=>{
    if(err) return cb(err);
    cb(null, isMatch);
  })
}


const generateToken = function(cb){
  let user = this;
  let token = jwt.sign(user._id.toHexString(), 'secretToken');

  user.token = token;
  user.save((err,user)=>{
      if(err) return cb(err);
      cb(null, user);
  })
}


const findByToken = async function(token, res){
  let user = this;
  try{
    const decoded = await jwt.verify(token, 'secretToken');
    const found_user = await user.findOne({"_id" :decoded, "token": token});

    return found_user;
  }catch(err){
    sendMongooseErr(err, res);
  }
}


const findVerifiedUser = function(token, cb){
  let user = this;

  jwt.verify(token, 'secretToken', (err,decoded)=>{
    user.findOne({"_id" :decoded, "token": token, "auth_email_verified":true}, (err,user)=>{
      if(err) return cb(err);
      cb(null, user);
    })
  })
}


UserModelContainer.set("crypt.password.email", cryptPasswordAndEmail);
UserModelContainer.set("generate.token", generateToken);
UserModelContainer.set("findby.token", findByToken);
UserModelContainer.set("find.verified.user", findVerifiedUser);
UserModelContainer.set("update.password", updatePassword);
UserModelContainer.set("compare.password", comparePassword);

module.exports = { UserModelContainer }
