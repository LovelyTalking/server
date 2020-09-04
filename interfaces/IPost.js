const moment = require('moment');

class IPostDTO {

  constructor(postInfo){
    this.__id = postInfo._id;
    this._posted_by = postInfo.posted_by;
    this._native_language =postInfo.native_language;
    this._target_language = postInfo.target_language;
    this._post_context = postInfo.post_context;
    this._post_images = postInfo.post_images;
    this._hashtags= postInfo.hashtags || [];
    this._like_users = postInfo.like_users || [];
    this._annotation_count= postInfo.annotation_count || 0;
    this._comment_object = postInfo.comment_object || [];
    this._correction_object= postInfo.correction_object|| [];
    this._register_date = postInfo.register_date;
    this._update_date = postInfo.update_date;
    this._delete_date = postInfo.delete_date;
    this._del_ny = postInfo.del_ny;
  }

  set PostInfo(postInfo){
    this.__id = postInfo._id;
    this._posted_by = postInfo.posted_by;
    this._native_language =postInfo.native_language;
    this._target_language = postInfo.target_language;
    this._post_context = postInfo.post_context;
    this._post_images = postInfo.post_images;
    this._hashtags= postInfo.hashtags;
    this._like_users = postInfo.like_users;
    this._annotation_count= postInfo.annotation_count;
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
      posted_by: this._posted_by,
      native_language: this._native_language,
      target_language: this._target_language,
      post_context: this._post_context,
      post_images : this._post_images,
      hashtags : this._hashtags,
      like_users :this._like_users,
      annotation_count: this._annotation_count,
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
      posted_by: this._posted_by,
      post_context: this._post_context
    }
  }

  getUploadPostInfo(){
    return {
      posted_by: this._posted_by,
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
      posted_by: this._posted_by,
      native_language: this._native_language,
      target_language: this._target_language,
      post_context: this._post_context,
      post_images: this._post_images,
      hashtags: this._hashtags,
      like_users: this._like_users ,
      annotation_count: this._annotation_count ,
      count_annotation : this._annotation_count.length
    }
  }

  getUpdateCheck(){
    return {
      _id: this.__id,
      posted_by: this._posted_by,
      post_context: this._post_context
    }
  }
  getUpdatePostInfo(){
    return {
      _id: this.__id,
      posted_by: this._posted_by,
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
      posted_by : super.PostInfo.posted_by,
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

  getLikeUserRelatedSearchOptionInfo(){
    return {
      post_id : super.PostInfo._id,
      page_index: this._page_index,
      page_size: this._page_size
    }
  }
}

module.exports = { IPostDTO, IPostListDTO }
