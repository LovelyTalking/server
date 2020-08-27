const mongoose = require('../configs/mongo.db.js');
const {UserModelContainer} = require('../containers/models/user.model.service')

const userSchema = mongoose.Schema({
  email:{
    type: String,
    trim: true,
    unique: true,
    maxLength: 300,
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
    maxLength: 25,
    required: true
  },
  native_language:{
    type: String,
    minLength: 2,
    maxLength: 2,
    required: true,
    uppercase: true
  },
  target_language:{
    type: String,
    minLength: 2,
    maxLength: 2,
    required: true,
    uppercase: true
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
    maxLength: 3000,
  },
  post_count:{
    type: Number,
    min: 0,
    max: 100000000
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
    type: Boolean,
    default : false
  },
  badges:[String]
})


userSchema.pre('save', UserModelContainer.get('crypt.password.email'));
userSchema.methods.comparePassword = UserModelContainer.get('compare.password');
userSchema.methods.generateToken = UserModelContainer.get('generate.token');
userSchema.methods.updatePassword = UserModelContainer.get('update.password');
userSchema.statics.findByToken = UserModelContainer.get('findby.token');
userSchema.statics.findVerifiedUser = UserModelContainer.get('find.verified.user');

const User = mongoose.model('User', userSchema);
module.exports = {User};
