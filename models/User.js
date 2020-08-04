const mongoose = require('../configs/mongo.db.js');
const userCtrl = require('../containers/models/user.model.service')

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
  auth_email_verified:{
    type:Boolean,
    required:true,
    default: false
  },
  auth_email_key:{
    type: String,
    required: true,
    default:"needs"
  },
  profile_image:{
    type: String,
    maxLength: 200
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


userSchema.pre('save', userCtrl.cryptPassword);
userSchema.methods.comparePassword = userCtrl.comparePassword;
userSchema.methods.generateToken = userCtrl.generateToken;
userSchema.statics.findByToken = userCtrl.findByToken;
userSchema.statics.findVerifiedUser = userCtrl.findVerifiedUser;

const User = mongoose.model('User', userSchema);
module.exports = {User};
