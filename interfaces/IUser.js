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

  set UserInfo(userInfo){
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

  get UserInfo(){
    return {
      _id: this._id,
      email : this.email,
      name : this.name,
      password: this.password,
      native_language: this.native_language,
      target_language: this.target_language,
      gender :  this.gender,
      auth_email_verified: this.auth_email_verified,
      auth_email_key: this.auth_email_key,
      profile_image : this.profile_image,
      profile_text : this.profile_text,
      post_count : this.post_count,
      token : this.token,
      register_date : this.register_date,
      update_date : this.update_date,
      delete_date : this.delete_date,
      del_ny : this.del_ny,
      badges : this.badges,
    }
  }

  getRegisterUserInfo(){
    return {
        email : this.email,
        name : this.name,
        password: this.password,
        native_language: this.native_language,
        target_language: this.target_language,
        gender :  this.gender,
        auth_email_verified: this.auth_email_verified,
        auth_email_key: this.auth_email_key,
        register_date : moment().format(),
        post_count : 0,
        del_ny : false
    }
  }

  getAuthInfo(){
    return {
      isAuth: true,
      _id: this._id,
      email : this.email,
      name : this.name,
      native_language: this.native_language,
      target_language: this.target_language,
      gender :  this.gender,
      profile_image : this.profile_image,
      profile_text : this.profile_text,
      post_count : this.post_count
    }
  }
}

module.exports= IUserDTO
