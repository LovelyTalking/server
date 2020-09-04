const mongoose = require('../configs/mongo.db.js');
const {PostModelContainer} = require('../containers/models/post.model.service')

const postSchema = mongoose.Schema({
  posted_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  native_language:{
    type:String,
    minLength: 2,
    maxlength: 2,
    required:true,
    uppercase: true
  },
  target_language:{
    type:String,
    minLength: 2,
    maxlength: 2,
    required:true,
    uppercase: true
  },
  post_context:{
    type: String,
    minLength: 3,
    maxLength: 3000
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
  like_users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  annotation_count:{
    type: Number,
    default: 0
  },
  comment_object:[{
    //@desc nested subdoc, _id는 자동 생성, 댓글 등록 수정 날짜 del_ny여부
    commented_by:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment_context: {
      type: String,
      minLength: 2,
      maxLength: 500
    },
    register_date: {
      type: String
    },
    delete_date:{
      type:String
    },
    del_ny :{
      type: Boolean,
      default: false,
    }
  }],
  correction_object:[{
    correction_by:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    correction_context: [{
      text:{
        type: String,
        minLength:0,
        maxLength:1500
      },
      modified:{
        type: Boolean,
        default: false
      }
    }],
    additional_text:{
      type: String,
      minLength: 0,
      maxLength: 2000
    },
    register_date: {
      type: String
    },
    delete_date:{
      type:String
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
postSchema.statics.findPostAndPushComment = PostModelContainer.get('find.post.push.comment');
postSchema.statics.findPostAndDeleteComment = PostModelContainer.get('find.post.delete.comment');
postSchema.statics.findPostAndPushCorrection = PostModelContainer.get('find.post.push.correction');
postSchema.statics.findPostAndDeleteCorrection = PostModelContainer.get('find.post.delete.correction');
postSchema.statics.getCommentListOfPost = PostModelContainer.get('get.comment.list.of.post')
postSchema.statics.getCorrectionListOfPost = PostModelContainer.get('get.correction.list.of.post');
postSchema.statics.updateLikeInPost = PostModelContainer.get('update.like.in.post');

const Post = mongoose.model('Post', postSchema);

module.exports = {Post};
