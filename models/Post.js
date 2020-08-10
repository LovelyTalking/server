const mongoose = require('../configs/mongo.db.js');
const PostContainer = require('../containers/models/post.model.service')

const postSchema = mongoose.Schema({
  user_id:{
    type: String,
    required: true
  },
  post_context:{
    type: String,
    minLength: 3,
    maxLength: 1000
  },
  post_images: [{
      type: String,
      maxLength: 200,
      minLength: 4
  }],
  //@desc TODO: hashtags-> 해시태그 아이디 모음
  hashtags:[{
      type: String,
      maxLength: 15,
      minLength: 1
  }],
  like_users: [String],
  annotaion_users: [String],
  comment_object:{
    //@desc nested subdoc, _id는 자동 생성, 댓글 등록 수정 날짜 del_ny여부
    user_id:{
      type: String,
      required: true
    },
    comment_context: {
      type: String,
      minLength: 2,
      maxLength: 400,
      required: true
    }
  },
  correction_object:{
    user_id:{
      type: String,
      required: true
    },
    comment_context: {
      type: String,
      minLength: 2,
      maxLength: 400,
      required: true
    }
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
  }
})


const Post = mongoose.model('Post', postSchema);
module.exports = {Post};
