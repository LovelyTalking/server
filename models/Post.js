const mongoose = require('../configs/mongo.db.js');
const {PostModelContainer} = require('../containers/models/post.model.service')

const postSchema = mongoose.Schema({
  user_id:{
    type: String,
    required: true
  },
  native_language:{
    type:String,
    minLength: 2,
    maxlength: 2,
    required:true
  },
  target_language:{
    type:String,
    minLength: 2,
    maxlength: 2,
    required:true
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
      maxLength: 30,
      minLength: 2
  }],
  like_users: [String],
  annotation_users: [String],
  comment_object:[{
    //@desc nested subdoc, _id는 자동 생성, 댓글 등록 수정 날짜 del_ny여부
    user_id:{
      type: String
    },
    comment_context: {
      type: String,
      minLength: 2,
      maxLength: 400
    },
    register_date: {
      type: String
    },
    del_ny :{
      type: Boolean,
      default: false,
    }
  }],
  correction_object:[{
    user_id:{
      type: String
    },
    comment_context: {
      type: String,
      minLength: 2,
      maxLength: 400
    },
    word_index_arr :[Number],
    register_date: {
      type: String
    },
    del_ny :{
      type: Boolean,
      default: false,
    }
  }],
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

// @desc 포스트 업로드 전에 hash tag가 생성되지 않은 태그이면 새로 생성해줘야 한다.
postSchema.pre('save', PostModelContainer.get('check.hashtag.update'));
postSchema.statics.findHashtagAndSave = PostModelContainer.get('find.hashtag.save');
const Post = mongoose.model('Post', postSchema);
module.exports = {Post};
