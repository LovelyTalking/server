const moment = require('moment');

class IUserDTO{
  constructor(userInfo)
  {
    this.__id = userInfo._id;
    this._email = userInfo.email;
    this._name = userInfo.name;
    this._password = userInfo.password;
    this._native_language = userInfo.native_language;
    this._target_language = userInfo.target_language;
    this._gender = userInfo.gender;
    this._auth_email_verified = userInfo.auth_email_verified;
    this._auth_email_key = userInfo.auth_email_key;
    this._profile_image = userInfo.profile_image;
    this._profile_text = userInfo.profile_text;
    this._post_count = userInfo.post_count;
    this._token = userInfo.token;
    this._register_date = userInfo.register_date;
    this._update_date = userInfo.update_date;
    this._delete_date = userInfo.delete_date;
    this._del_ny = userInfo.del_ny;
    this._badges = userInfo.badges;
  }

  set UserInfo(userInfo){
    this.__id = userInfo._id;
    this._email = userInfo.email;
    this._name = userInfo.name;
    this._password = userInfo.password;
    this._native_language = userInfo.native_language;
    this._target_language = userInfo.target_language;
    this._gender = userInfo.gender;
    this._auth_email_verified = userInfo.auth_email_verified;
    this._auth_email_key = userInfo.auth_email_key;
    this._profile_image = userInfo.profile_image;
    this._profile_text = userInfo.profile_text;
    this._post_count = userInfo.post_count;
    this._token = userInfo.token;
    this._register_date = userInfo.register_date;
    this._update_date = userInfo.update_date;
    this._delete_date = userInfo.delete_date;
    this._del_ny = userInfo.del_ny;
    this._badges = userInfo.badges;
  }

  get UserInfo(){
    return {
      _id: this.__id,
      email : this._email,
      name : this._name,
      password: this._password,
      native_language: this._native_language,
      target_language: this._target_language,
      gender :  this._gender,
      auth_email_verified: this._auth_email_verified,
      auth_email_key: this._auth_email_key,
      profile_image : this._profile_image,
      profile_text : this._profile_text,
      post_count : this._post_count,
      token : this._token,
      register_date : this._register_date,
      update_date : this._update_date,
      delete_date : this._delete_date,
      del_ny : this._del_ny,
      badges : this._badges,
    }
  }

  getRegisterUserInfo(){
    return {
        email : this._email,
        name : this._name,
        password: this._password,
        native_language: this._native_language,
        target_language: this._target_language,
        gender :  this._gender,
        auth_email_verified: this._auth_email_verified,
        auth_email_key: this._auth_email_key,
        register_date : moment().format(),
        post_count : 0,
        del_ny : false
    }
  }

  getAuthInfo(){
    return {
      isAuth: true,
      _id: this.__id,
      email : this._email,
      name : this._name,
      native_language: this._native_language,
      target_language: this._target_language,
      gender :  this._gender,
      profile_image : this._profile_image,
      profile_text : this._profile_text,
      post_count : this._post_count
    }
  }

  getUploadImageInfo(){
    return {
      _id: this.__id,
      profile_image: this._profile_image,
      update_date: moment().format()
    }
  }

  getUploadTextInfo(){
    return {
      _id: this.__id,
      profile_text : this._profile_text,
      update_date: moment().format()
    }
  }

  getUpdateUserInfo(){
    return{
      _id: this.__id,
      name: this._name,
      native_language: this._native_language,
      target_language: this._target_language,
      gender: this._gender,
      update_date: moment().format()
    }
  }

  getUpdateUserPasswordInfo(){
    return {
      _id: this.__id,
      password: this._password,
      update_date: moment().format()
    }
  }

  getDeleteUserInfo(){
    return {
      _id: this.__id,
      token: "",
      update_date: moment().format(),
      delete_date: moment().format(),
      del_ny: true
    }
  }

  getReturnUserInfo(){
    return {
      _id : this.__id,
      email : this._email,
      name : this._name,
      native_language: this._native_language,
      target_language: this._target_language,
      gender :  this._gender,
      profile_image : this._profile_image,
      profile_text : this._profile_text,
      post_count : this._post_count

    }
  }
}

class IUserListDTO extends IUserDTO{
  constructor(user_info){
    super(user_info);
    this._page_index = parseInt(user_info.page_index,10);
    this._page_size = parseInt(user_info.page_size, 10);
  }

  getUserListSearchOptionInfo(){
    return {
      name: super.UserInfo.name,
      page_index : this._page_index,
      page_size : this._page_size
    }
  }

}
module.exports= {IUserDTO, IUserListDTO}
