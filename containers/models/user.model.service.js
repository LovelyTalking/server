const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const {IUserDTO} = require('../../interfaces/IUser')
const UserModelContainer = require('typedi').Container;
const {ErrorContainer} = require('../../containers/errors/message.error');

const CustomError = ErrorContainer.get('custom.error')

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
    return next();
  }
};

const cryptEmail = function(user, salt, next){
  bcrypt.hash(user.email, salt, (err,hash)=>{
    if(err) return next(err);
    user.auth_email_key = hash;
    return next();
  })
}

const updatePassword = async function(new_password,update_date){
  try{
    let user = this;

    const salt = await bcrypt.genSalt(saltRounds);
    const hashed_password = await bcrypt.hash(new_password, salt);

    const updated_user = await user.updateOne({$set: {password:hashed_password, update_date: update_date }},{new: true,runValidators:true})

    return {err: null, updated_user};
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return {err: err, status:400};
    else return {err:err, status:500}
  }
};

const comparePassword = async function(plainPass, cb){
  try{
    const isMatch = await bcrypt.compare(plainPass, this.password);
    return {err:null, isMatch};
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return {err: err, status:400};
    else return {err:err, status:500}
  }
}


const generateToken = async function(){
  try {
    let user = this;

    let token = jwt.sign({id:user._id.toHexString()}, secret,{ expiresIn: 3600*24*1000, issuer: 'PLaCon'});

    user.token = token;
    const saved_user = await user.save();
    return {err:null, saved_user};
  } catch(err){
    console.log(err);
    if( err instanceof CustomError) return {err: err, status:400};
    else return {err:err, status:500}
  }
}


const findByToken = async function(token, res){
  let user = this;
  try{
    const decoded = await jwt.verify(token, secret);

    const found_user = await user.findOne({"_id" :decoded.id, "token": token});

    return found_user;
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return {err: err, status:400};
    else return {err:err, status:500}
  }
}


const findVerifiedUser = async function(token){
  try{
    let user = this;

    const decoded = await jwt.verify(token, secret);
    const found_user = await user.findOne({"_id" :decoded.id, "token": token, "auth_email_verified":true});
    if(!found_user) throw new CustomError(500,"토큰에 해당하는 유저를 찾을 수 없습니다.");

    return {err:null, user: found_user};
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return {err: err, status:400};
    else if(err.name === 'TokenExipredError'){
      return { err: err, status:419}
    }
    else return {err:err, status:500}
  }
}


UserModelContainer.set("crypt.password.email", cryptPasswordAndEmail);
UserModelContainer.set("generate.token", generateToken);
UserModelContainer.set("findby.token", findByToken);
UserModelContainer.set("find.verified.user", findVerifiedUser);
UserModelContainer.set("update.password", updatePassword);
UserModelContainer.set("compare.password", comparePassword);

module.exports = { UserModelContainer }
