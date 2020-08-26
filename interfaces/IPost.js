const moment = require('moment');

class IPostDTO {

  constructor(postInfo){
    this.__id = postInfo._id;
    this._user_id = postInfo.user_id;
    this._native_language =postInfo.native_language;
    this._target_language = postInfo.target_language;
    this._post_context = postInfo.post_context;
    this._post_images = postInfo.post_images;
    this._hashtags= postInfo.hashtags || [];
    this._like_users = postInfo.like_users || [];
    this._annotation_users= postInfo.annotation_users || [];
    this._comment_object = postInfo.comment_object || [];
    this._correction_object= postInfo.correction_object|| [];
    this._register_date = postInfo.register_date;
    this._update_date = postInfo.update_date;
    this._delete_date = postInfo.delete_date;
    this._del_ny = postInfo.del_ny;
  }

  set PostInfo(postInfo){
    this.__id = postInfo._id;
    this._user_id = postInfo.user_id;
    this._native_language =postInfo.native_language;
    this._target_language = postInfo.target_language;
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
      native_language: this._native_language,
      target_language: this._target_language,
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
      native_language: this._native_language,
      target_language: this._target_language,
      post_context: this._post_context,
      post_images: this._post_images,
      hashtags: this._hashtags,
      register_date: moment().format()
    }
  }

  getReturnPostInfo(){
    return {
      _id: this.__id,
      user_id: this._user_id,
      native_language: this._native_language,
      target_language: this._target_language,
      post_context: this._post_context,
      post_images: this._post_images,
      hashtags: this._hashtags,
      like_users: this._like_users ,
      count_like : this._like_users.length,
      annotation_users: this._annotation_users ,
      count_annotation : this._annotation_users.length
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
}

class IPostListDTO extends IPostDTO{
  constructor(post_list){
    super(post_list);
    this._page_index = parseInt(post_list.page_index,10);
    this._page_size = parseInt(post_list.page_size, 10);
    this._hashtag_name = post_list.hashtag_name;
  }

  get SearchScopeInfo(){
    return {
      page_index: this._page_index,
      page_size : this._page_size
    }
  }

  getUserRelatedSearchOptionInfo(){
    return {
      user_id : super.PostInfo.user_id,
      page_index: this._page_index,
      page_size: this._page_size
    }
  }

  getLangRelatedSearchOptionInfo(){
    return {
      native_language : super.PostInfo.native_language,
      target_language : super.PostInfo.target_language,
      page_index: this._page_index,
      page_size: this._page_size
    }
  }

  getHashtagRelatedSearchOptionInfo(){
    return {
      native_language : super.PostInfo.native_language,
      target_language : super.PostInfo.target_language,
      hashtag_name : this._hashtag_name,
      page_index: this._page_index,
      page_size: this._page_size
    }
  }
}

module.exports = { IPostDTO, IPostListDTO }
