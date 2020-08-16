const {Post} = require('../../models/Post');
const {ICommentDTO} = require('../../interfaces/IComment');
const {ErrorMessageContainer} = require('../../containers/errors/message.error');

/*
  @desc TODO: 댓글기능 3가지
  1) 해당 포스트의 댓글 작성
  2) 해당 포스터의 댓글 리스트(조건) 조회
  3) 해당 댓글 제거
*/

const uploadComment = async (req,res)=>{
  try{
    req.body["user_id"] = String(req.user._id);
    const commentDTO = new ICommentDTO(req.body);

    const check_info = commentDTO.getCheckUploadInfo();
    for(const prop in check_info){
      if(!check_info[prop])
        return res.status(400).json({upload_comment_success:false, err:"해당 요청 데이터에 빈 데이터가 있습니다."})
    }

    const upload_info = commentDTO.getUploadCommentInfo();
    const comment_info = await Post.findPostAndPushComment(upload_info, res);

    if(comment_info.err)
      return res.status(400).json({upload_comment_success:false, err: comment_info.err});

    return res.status(200).json({
      upload_comment_success: true,
      uploaded_comment : comment_info.uploaded_comment
    });
  }catch(err){
    return sendMongooseErr(err, res);
  }
}


const deleteComment = async (req,res)=>{
  try{
    req.params["user_id"] = String(req.user._id);
    const commentDTO = new ICommentDTO(req.params);
    const delete_info = commentDTO.getDeleteCommentInfo();

    for(const prop in delete_info){
      if(!delete_info[prop])
        return res.status(400).json({delete_comment_success:false, err:"해당 요청 데이터에 빈 데이터가 있습니다."})
    }

    const comment_info = await Post.findPostAndDeleteComment(delete_info,res);
    if(comment_info.err)
      return res.status(400).json({delete_comment_success:false, err: comment_info.err });

    return res.status(200).json({
      delete_comment_success: true,
      deleted_comment: comment_info.deleted_comment
    })
  }catch(err){
    return sendMongooseErr(err, res);
  }
}

// @desc 서비스로직에서 필요한 부품들
const sendMongooseErr = ErrorMessageContainer.get('mongoDB.error');

module.exports = {
  uploadComment,deleteComment
}
