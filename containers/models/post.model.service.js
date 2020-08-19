const PostModelContainer = require('typedi').Container;
const {Hashtag} = require('../../models/Hashtag');
const {IHashtagDTO} = require('../../interfaces/IHashtag');
const {ICommentDTO} = require('../../interfaces/IComment');
const {ICorrectionDTO} = require('../../interfaces/ICorrection');
const {ErrorContainer} = require('../errors/message.error');

const CustomError= ErrorContainer.get('custom.error');

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

const findHashtagAndSave = async function(hashtags){
  try{
    for(const hashtag_name of hashtags){
      const found_hashtag = await Hashtag.findOne({name:hashtag_name});
      if(!found_hashtag){
        const hashtagDTO = new IHashtagDTO();
        hashtagDTO.name= hashtag_name;
        const insert_hashtag = hashtagDTO.name;

        const hashtag_doc = new Hashtag(insert_hashtag);
        await hashtag_doc.save();
      }
    }
    return {err:null};

  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return {err: err, status:400};
    else return {err:err, status:500}
  }
}

const findPostAndPushComment = async function(upload_info){
  try{
    const post = await this.findOne({_id: upload_info.post_id, del_ny:false});
    if(!post) throw new CustomError(500, "해당 포스트 정보가 없습니다.");

    const comment_index = await post.comment_object.push(upload_info);
    await post.annotation_users.push(upload_info.user_id);
    const uploaded_post = await post.save();
    if(!uploaded_post) throw new CustomError(500,"포스트에 저장되지 않았습니다")

    let uploaded_comment = new ICommentDTO(post.comment_object[comment_index-1]).getReturnOneCommentInfo();
    uploaded_comment.annotation_size = post.annotation_users.length;

    return {
      err: null,
      uploaded_comment
    }
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return {err: err, status:400};
    else return {err:err, status:500}
  }
}

const findPostAndDeleteComment = async function(delete_info, res){
  try{
    const post = await this.findOne({_id: delete_info.post_id, del_ny:false});
    if(!post) throw new CustomError(500,"해당 포스트 정보가 없습니다.");

    let comment_doc = post.comment_object.id(delete_info._id);
    if(!comment_doc) throw new CustomError(500,"해당 아이디의 댓글이 없습니다")
    if(comment_doc.del_ny || comment_doc.user_id !== delete_info.user_id)
      throw new CustomError(400, "해당 댓글은 지울 수 없습니다.")

    comment_doc.del_ny =true;
    comment_doc.delete_date = delete_info.delete_date;
    const idx = post.annotation_users.indexOf(delete_info.user_id);
    if(idx === -1) throw new CustomError(500,"지운 댓글에 해당하는 작성자가 작성자 배열에 없습니다.");
    if(idx>-1) post.annotation_users.splice(idx,1);

    const deleted_post = await post.save();
    if(!deleted_post) throw new CustomError(500,"해당 포스트에 저장되지 않았습니다.");

    let deleted_comment = new ICommentDTO(comment_doc).getReturnOneCommentInfo();
    deleted_comment.annotation_size = deleted_post.annotation_users.length;

    return {
      err: null,
      deleted_comment
    }
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return {err: err, status:400};
    else return {err:err, status:500}
  }
}

const findPostAndPushCorrection = async function(upload_info, res){
  try{
    let post = await this.findOne({_id: upload_info.post_id, del_ny: false});
    if(!post) throw new CustomError(500,"해당 포스트 정보가 없습니다.");

    const correct_index =post.correction_object.push(upload_info);
    await post.annotation_users.push(upload_info.user_id);

    const uploaded_post = await post.save();
    if(!uploaded_post) throw new CustomError(500,"포스트에 저장되지 않았습니다");

    const uploaded_correction = new ICorrectionDTO(post.correction_object[correct_index-1]).getReturnOneCorrectionInfo();
    uploaded_correction.annotation_size = uploaded_post.annotation_users.length;

    return {
      err: null,
      uploaded_correction
    }
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return {err: err, status:400};
    else return {err:err, status:500}
  }
}

const findPostAndDeleteCorrection = async function(delete_info,res){
  try{
    let post = await this.findOne({_id: delete_info.post_id, del_ny:false});
    if(!post) throw new CustomError(500,"해당 포스트 정보가 없습니다.");

    let correction_doc = post.correction_object.id(delete_info._id);
    if(!correction_doc) throw new CustomError(500,"해당 아이디의 댓글이 없습니다")
    if(correction_doc.del_ny || correction_doc.user_id !== delete_info.user_id)
      throw new CustomError(400, "해당 댓글은 지울 수 없습니다.")

    correction_doc.del_ny =true;
    correction_doc.delete_date = delete_info.delete_date;
    const idx = post.annotation_users.indexOf(delete_info.user_id);
    if(idx === -1) throw new CustomError(500,"지운 댓글에 해당하는 작성자가 작성자 배열에 없습니다.");
    if(idx>-1) post.annotation_users.splice(idx,1);

    const deleted_post = await post.save();
    if(!deleted_post) throw new CustomError(500,"해당 포스트에 저장되지 않았습니다.");

    let deleted_correction = new ICorrectionDTO(correction_doc).getReturnOneCorrectionInfo();
    deleted_correction.annotation_size = deleted_post.annotation_users.length;

    return {
      err: null,
      deleted_correction
    };
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return {err: err, status:400};
    else return {err:err, status:500}
  }
}

const getCommentListOfPost = async function(search_info,res){
  try{
    let post = await this.findOne({_id: search_info.post_id, del_ny:false});
    if(!post) throw new CustomError(500,"해당 포스트 정보가 없습니다.");

    let start = search_info.start;
    let max_size = search_info.size;
    const limit = post.comment_object.length;
    let comment_list =[];

    while(start< limit){
      if(max_size === 0) break;

      if(post.comment_object[start].del_ny === false){
        comment_list.push(post.comment_object[start]);
        --max_size;
      }
      start++;
    }

    const next_page_index = start;

    return {
      err:null,
      next_page_index,
      comment_list
    }

  }catch(err){
    console.log(err);
    return {err : err};
  }
}

const getCorrectionListOfPost = async function(search_info,res){
  try{
    let post = await this.findOne({_id: search_info.post_id, del_ny:false});
    if(!post) throw new CustomError(500,"해당 포스트 정보가 없습니다.");

    let start = search_info.start;
    let max_size = search_info.size;
    const limit = post.correction_object.length;
    let correction_list =[];

    while(start< limit){
      if(max_size === 0) break;

      if(post.correction_object[start].del_ny === false){
        correction_list.push(post.correction_object[start]);
        --max_size;
      }
      start++;
    }

    const next_page_index = start;
    const ret_info = { next_page_index, correction_list}
    console.log(ret_info);
    return {
      err:null,
      next_page_index,
      correction_list
    }
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return {err: err, status:400};
    else return {err:err, status:500}
  }
}

PostModelContainer.set('check.hashtag.update', checkHashtagAndUpdate);
PostModelContainer.set('find.hashtag.save', findHashtagAndSave );
PostModelContainer.set('find.post.push.comment', findPostAndPushComment);
PostModelContainer.set('find.post.delete.comment', findPostAndDeleteComment);
PostModelContainer.set('find.post.push.correction', findPostAndPushCorrection);
PostModelContainer.set('find.post.delete.correction', findPostAndDeleteCorrection);
PostModelContainer.set('get.comment.list.of.post', getCommentListOfPost);
PostModelContainer.set('get.correction.list.of.post', getCorrectionListOfPost);
module.exports = { PostModelContainer }
