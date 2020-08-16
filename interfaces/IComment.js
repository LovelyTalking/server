const moment = require('moment');

class ICommentDTO {
  constructor(comment_info){
    this.__id = comment_info._id;
    this._post_id = comment_info.post_id;
    this._user_id = comment_info.user_id;
    this._comment_context = comment_info.comment_context;
    this._register_date = comment_info.register_date;
    this._delete_date = comment_info.delete_date;
    this._del_ny = comment_info.del_ny;
    this._annotation_size = 0;
  }

   set annotaion_size(size){
     this._annotation_size = size;
   }

  get CommentInfo(){
    return {
      _id : this.__id,
      post_id : this._post_id,
      user_id : this._user_id,
      comment_context : this._comment_context,
      register_date : this._register_date,
      delete_date : this._delete_date,
      del_ny: this._del_ny,
      annotion_size : this._annotation_size
    }
  }

  getCheckUploadInfo(){
    return {
      post_id: this._post_id,
      user_id: this._user_id,
      comment_context : this._comment_context
    }
  }

  getUploadCommentInfo(){
    return {
      post_id: this._post_id,
      user_id: this._user_id,
      comment_context : this._comment_context,
      register_date : moment().format()
    }
  }

  getDeleteCommentInfo(){
    return{
      _id : this.__id,
      user_id : this._user_id,
      post_id : this._post_id,
      delete_register: moment().format(),
      del_ny: true
    }
  }

  getReturnOneCommentInfo(){
    return {
      _id : this.__id,
      user_id: this._user_id,
      comment_context: this._comment_context,
      del_ny : this._del_ny,
      register_date : this._register_date,
      annotation_size : this._annotation_size
    }
  }
}

module.exports = {
  ICommentDTO
}
