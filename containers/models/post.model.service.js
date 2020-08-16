const PostModelContainer = require('typedi').Container;
const {Hashtag} = require('../../models/Hashtag');
const {IHashtagDTO} = require('../../interfaces/IHashtag');
const {ICommentDTO} = require('../../interfaces/IComment');
const {ICorrectionDTO} = require('../../interfaces/ICorrection');
const {ErrorMessageContainer} = require('../errors/message.error');

const checkHashtagAndUpdate = function(next){
  let post = this;
  let hashtags = post.hashtags;
  hashtags.forEach((hashtag_name) => {
    Hashtag.findOne({name:hashtag_name}, (err, found_hashtag)=>{
      if(err) next(err);

      if(!found_hashtag){
        const hashtagDTO = new IHashtagDTO();
        hashtagDTO.name= hashtag_name;

        const insert_hashtag = hashtagDTO.name;

        const hashtag_doc = new Hashtag(insert_hashtag);
        hashtag_doc.save((err,saved_hashtag)=>{
          if(err) next(err);
        })
      }
    })
  });
  next();
}

const findHashtagAndSave = async function(hashtags,res){
  hashtags.forEach(async (hashtag_name) => {
    try{
      const found_hashtag = await Hashtag.findOne({name:hashtag_name});
      if(!found_hashtag){
        const hashtagDTO = new IHashtagDTO();
        hashtagDTO.name= hashtag_name;
        const insert_hashtag = hashtagDTO.name;

        const hashtag_doc = new Hashtag(insert_hashtag);
        await hashtag_doc.save();
      }
    }catch(err){
      return sendMongooseErr(err,res);
    }
  })
}

const findPostAndPushComment = async function(upload_info, res){
  try{
    const post = await this.findOne({_id: upload_info.post_id, del_ny:false});
    if(!post) return {err: "해당 포스트 정보가 없습니다."};

    post.comment_object.push(upload_info);
    post.annotation_users.push(upload_info.user_id);
    const uploaded_post = await post.save();
    if(!uploaded_post) return {err: "포스트에 저장되지 않았습니다"};

    let uploaded_comment = new ICommentDTO(upload_info).getReturnOneCommentInfo();
    uploaded_comment.annotation_size = post.annotation_users.length;

    return {
      err: null,
      uploaded_comment
    }
  }catch(err){
    return sendMongooseErr(err,res);
  }
}

const findPostAndDeleteComment = async function(delete_info, res){
  try{
    const post = await this.findOne({_id: delete_info.post_id, del_ny:false});
    if(!post) return {err: "해당 포스트 정보가 없습니다."};

    let deleted_comment;
    let is_update = false;

    // @desc 반복문을 사용할 수 밖에 없는 이유: 클라에서 인덱스를 줘도 디비의 인덱스와 다르다
    is_update = post.comment_object.some(comment =>{
      if(String(comment._id) === delete_info._id && comment.user_id === delete_info.user_id && comment.del_ny === false){
        comment["del_ny"] = true;
        comment["delete_date"] = delete_info.delete_date;

        const idx = post.annotation_users.indexOf(delete_info.user_id);
        if(idx === -1) return {err: "지운 댓글에 해당하는 작성자가 작성자 배열에 없습니다."}
        if(idx>-1) post.annotation_users.splice(idx,1);
        deleted_comment = new ICommentDTO(comment).getReturnOneCommentInfo();

        return true;
      }
    })

    if(!is_update) return { err: "제거된 댓글이 없습니다."};

    const deleted_post = await post.save();
    if(!deleted_post) return { err: "해당 포스트에 저장되지 않았습니다."};

    deleted_comment.annotation_size = deleted_post.annotation_users.length;

    return {
      err: null,
      deleted_comment
    }
  }catch(err){
    return sendMongooseErr(err,res);
  }
}

const findPostAndPushCorrection = async function(upload_info, res){
  try{
    let post = await this.findOne({_id: upload_info.post_id, del_ny: false});
    if(!post) return {err: "해당 포스트 정보가 없습니다."};

    post.correction_object.push(upload_info);
    post.annotation_users.push(upload_info.user_id);

    const uploaded_post = await post.save();
    if(!uploaded_post) return {err: "포스트에 저장되지 않았습니다"};

    const uploaded_correction = new ICorrectionDTO(upload_info).getReturnOneCorrectionInfo();
    uploaded_correction.annotation_size = uploaded_post.annotation_users.length;

    return {
      err: null,
      uploaded_correction
    }
  }catch(err){
    return sendMongooseErr(err, res);
  }
}

const findPostAndDeleteCorrection = async function(delete_info,res){
  try{
    let post = await this.findOne({_id: delete_info.post_id, del_ny:false});
    if(!post) return {err: "해당 포스트 정보가 없습니다."};

    let deleted_correction;
    let is_update = false;
    
    is_update = post.correction_object.some(correction=>{
      if(String(correction._id) === delete_info._id && correction.user_id === delete_info.user_id && correction.del_ny === false){
        correction["del_ny"] =true;
        correction["delete_date"] = delete_info.delete_date;

        const idx = post.annotation_users.indexOf(delete_info.user_id);
        if(idx === -1) return {err: "지운 첨삭에 해당하는 작성자가 작성자 배열에 없습니다."}
        if(idx>-1) post.annotation_users.splice(idx,1);
        deleted_correction = new ICorrectionDTO(correction).getReturnOneCorrectionInfo();

        return true;
      }
    });
    if(!is_update) return { err: "지워진 첨삭이 없습니다."};

    const deleted_post = await post.save();
    if(!deleted_post) return {err: "지원진 첨삭에 대한 포스트를 저장할 수 없습니다."}

    deleted_correction.annotation_size = deleted_post.annotation_users.length;

    return {
      err: null,
      deleted_correction
    };
  }catch(err){
    return sendMongooseErr(err,res);
  }
}

const sendMongooseErr= ErrorMessageContainer.get('mongoDB.error');

PostModelContainer.set('check.hashtag.update', checkHashtagAndUpdate);
PostModelContainer.set('find.hashtag.save', findHashtagAndSave );
PostModelContainer.set('find.post.push.comment', findPostAndPushComment);
PostModelContainer.set('find.post.delete.comment', findPostAndDeleteComment);
PostModelContainer.set('find.post.push.correction', findPostAndPushCorrection);
PostModelContainer.set('find.post.delete.correction', findPostAndDeleteCorrection);
module.exports = { PostModelContainer }
