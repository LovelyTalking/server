const moment = require('moment');

class IPostDTO {

  constructor(postInfo){
    this._id = postInfo._id;
    this.user_id = postInfo.user_id;
    this.post_context = postInfo.post_context;
    this.post_images = postInfo.post_images;
    this.hashtags= postInfo.hashtags;
    this.like_users = postInfo.like_users;
    this.annotaion_users= postInfo.annotaion_users;
    this.comment_object = postInfo.comment_object;
    this.correction_object= postInfo.correction_object;
    this.register_date = postInfo.register_date;
    this.update_date = postInfo.update_date;
    this.delete_date = postInfo.delete_date;
    this.del_ny = postInfo.del_ny;
  }

  set PostInfo(postInfo){
    this._id = postInfo._id;
    this.user_id = postInfo.user_id;
    this.post_context = postInfo.post_context;
    this.post_images = postInfo.post_images;
    this.hashtags= postInfo.hashtags;
    this.like_users = postInfo.like_users;
    this.annotation_users= postInfo.annotation_users;
    this.comment_object = postInfo.comment_object;
    this.correction_object= postInfo.correction_object;
    this.register_date = postInfo.register_date;
    this.update_date = postInfo.update_date;
    this.delete_date = postInfo.delete_date;
    this.del_ny = postInfo.del_ny;
  }

  get PostInfo(){
    return {
      _id : this._id,
      user_id: this.user_id,
      post_context: this.post_context,
      post_images : this.post_images,
      hashtags : this.hashtags,
      like_users :this.like_users,
      annotation_users: this.annotaion_users,
      comment_object : this.comment_object,
      correction_object: this.correction_object,
      register_date : this.register_date,
      update_date : this.update_date,
      delete_date : this.delete_date,
      del_ny : this.del_ny
    }
  }

  getUploadPostInfo(){
    return {
      user_id: this.user_id,
      post_context: this.post_context,
      post_images: this.post_images,
      hashtags: this.hashtags,
      register_date: moment().format()
    }
  }
}
