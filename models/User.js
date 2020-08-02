const mongoose = require('../configs/mongo.db.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  email:{
    type: String,
    trim: true,
    unique: true,
    maxLength: 100,
    required :true
  },
  name:{
    type: String,
    maxLength: 100,
    required : true
  },
  password:{
    type: String,
    minLength: 8,
    maxLength: 50,
    required: true
  },
  native_language:{
    type: String,
    minLength: 2,
    maxLength: 2,
    required: true
  },
  target_language:{
    type: String,
    minLength: 2,
    maxLength: 2,
    required: true
  },
  gender:{
    type: String,
    required: true
  },
  auth_email_key:{
    type: String
  },
  profile_image:{
    type: String,
    maxLength: 200,
    required : true
  },
  profile_text:{
    type: String,
    maxLength: 1000,
  },
  post_count:{
    type: Number,
    max: 10000
  },
  token:{
    type: String
  },
  register_date:{
    type: String
  },
  update_date:{
    type: String
  },
  delete_date:{
    type: String
  },
  del_ny:{
    type: Boolean
  },
  badges:{
    type: String
  }
})


userSchema.pre('save', (next)=>{
  let user = this;

  if(user.isModified('password')){
    
    bcrypt.genSalt(saltRounds, (err,salt)=>{
      if(err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) =>{
        if(err) return next(err);
        user.password = hash;
        next();
      })
    })
  }else{
    next();
  }
})

userSchema.methods.comparePassword = (plainPass, cb)=>{
  bcrypt.compare(plainPass, this.password, (err, isMatch)=>{
    if(err) return cb(err);
    cn(null, isMatch);
  })
}

userSchema.methods.generateToken = (cb)=>{
  let user = this;
  let token = jwt.sign(user._id.toHexString(), 'secretToken');

  user.token = token;
  user.save((err,user)=>{
      if(err) return cb(err);
      cn(null, user);
  })
}

userSchema.statics.findByToken = (token, cb)=>{
  let user= this;

  jwt.verify(token, 'secretToken', (err,decoded)=>{
    user.findOne({"_id" :decoded, "token": token}, (err,user)=>{
      if(err) return cb(err);
      cb(null, user);
    })
  })
}

const User = mongoose.model('User', userSchema);
module.exports = {User};
