const moment = require('moment');

class IPostDTO {

  constructor(postInfo){
    this.__id = postInfo._id;
    this._user_id = postInfo.user_id;
    this._post_context = postInfo.post_context;
    this._post_images = postInfo.post_images;
    this._hashtags= postInfo.hashtags;
    this._like_users = postInfo.like_users;
    this._annotation_users= postInfo.annotation_users;
    this._comment_object = postInfo.comment_object;
    this._correction_object= postInfo.correction_object;
    this._register_date = postInfo.register_date;
    this._update_date = postInfo.update_date;
    this._delete_date = postInfo.delete_date;
    this._del_ny = postInfo.del_ny;
  }

  set PostInfo(postInfo){
    this.__id = postInfo._id;
    this._user_id = postInfo.user_id;
    this._post_context = postInfo.post_context;
    this._post_images = postInfo.post_images;
    this._hashtags= postInfo.hashtags;
    this._like_users = postInfo.like_users;
    this._annotation_users= postInfo.annotation_users;
    this._comment_object = postInfo.comment_object;
    this._correction_object= postInfo.correction_object;
    this._register_date = postInfo.register_date;
    this._update_date = postInfo.update_date;
    this._delete_date = postInfo.delete_date;
    this._del_ny = postInfo.del_ny;
  }

  get PostInfo(){
    return {
      _id : this.__id,
      user_id: this._user_id,
      post_context: this._post_context,
      post_images : this._post_images,
      hashtags : this._hashtags,
      like_users :this._like_users,
      annotation_users: this._annotation_users,
      comment_object : this._comment_object,
      correction_object: this._correction_object,
      register_date : this._register_date,
      update_date : this._update_date,
      delete_date : this._delete_date,
      del_ny : this._del_ny
    }
  }


  getUploadCheck(){
    return {
      user_id: this._user_id,
      post_context: this._post_context
    }
  }
  getUploadPostInfo(){
    return {
      user_id: this._user_id,
      post_context: this._post_context,
      post_images: this._post_images,
      hashtags: this._hashtags,
      register_date: moment().format()
    }
  }

  getOnePostInfo(){
    return {
      _id: this.__id,
      user_id: this._user_id,
      post_context: this._post_context,
      post_images: this._post_images,
      hashtags: this._hashtags,
      like_users: this._like_users ,
      count_like : this._like_users.length,
      annotation_users: this._annotation_users ,
      count_annotation : this._annotation_users.length,
      comment_object: this._comment_object,
      correction_object: this._correction_object
    }
  }

  getUpdateCheck(){
    return {
      _id: this.__id,
      user_id: this._user_id,
      post_context: this._post_context
    }
  }
  getUpdatePostInfo(){
    return {
      _id: this.__id,
      user_id: this._user_id,
      post_context: this._post_context,
      post_images: this._post_images,
      hashtags: this._hashtags,
      update_date : moment().format()
    }
  }

  getCheckRequiredPostInfo(){
    return {

    }
  }

}

module.exports = IPostDTO
