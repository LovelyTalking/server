const moment = require('moment');

class IUserDTO{
  constructor(userInfo)
  {
    this._id = userInfo._id;
    this.email = userInfo.email;
    this.name = userInfo.name;
    this.password = userInfo.password;
    this.native_language = userInfo.native_language;
    this.target_language = userInfo.target_language;
    this.gender = userInfo.gender;
    this.auth_email_verified = userInfo.auth_email_verified;
    this.auth_email_key = userInfo.auth_email_key;
    this.profile_image = userInfo.profile_image;
    this.profile_text = userInfo.profile_text;
    this.post_count = userInfo.post_count;
    this.token = userInfo.token;
    this.register_date = userInfo.register_date;
    this.update_date = userInfo.update_date;
    this.delete_date = userInfo.delete_date;
    this.del_ny = userInfo.del_ny;
    this.badges = userInfo.badges;
  }

  set UserInfo(value){
    this.userInfo = value;
  }
  get UserInfo(){
    return userInfo;
  }

  get RegisterUserInfo(){
    return {
        email : this.email,
        name : this.name,
        password: this.password,
        native_language: this.native_language,
        target_language: this.target_language,
        gender :  this.gender,
        auth_email_verified: this.auth_email_verified,
        auth_email_key: this.auth_email_key,
        register_date : moment().format()
    }
  }
}

module.exports= IUserDTO
