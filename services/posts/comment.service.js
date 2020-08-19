const {Post} = require('../../models/Post');
const {ICommentDTO,ICommentListDTO} = require('../../interfaces/IComment');
const { mergeListUserService }  = require('../../containers/lists/merge');
const {ErrorContainer} = require('../../containers/errors/message.error');

const CustomError = ErrorContainer.get('custom.error');
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
    for(const prop in check_info)
      if(!check_info[prop]) throw new CustomError(400, "해당 요청 데이터에 빈 데이터가 있습니다.")

    const upload_info = commentDTO.getUploadCommentInfo();
    const comment_info = await Post.findPostAndPushComment(upload_info, res);

    if(comment_info.err) throw new CustomError(comment_info.status, "댓글을 작성하는 곳에서 에러")

    return res.status(200).json({
      upload_comment_success: true,
      uploaded_comment : comment_info.uploaded_comment
    });
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}


const deleteComment = async (req,res)=>{
  try{
    req.params["user_id"] = String(req.user._id);
    const commentDTO = new ICommentDTO(req.params);
    const delete_info = commentDTO.getDeleteCommentInfo();

    for(const prop in delete_info)
      if(!delete_info[prop]) throw new CustomError(400, "해당 요청 데이터에 빈 데이터가 있습니다.")

    const comment_info = await Post.findPostAndDeleteComment(delete_info,res);
    if(comment_info.err) throw new CustomError(comment_info.status, "댓글을 지우는 곳에서 에러")

    return res.status(200).json({
      delete_comment_success: true,
      deleted_comment: comment_info.deleted_comment
    })
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}

const displayCommentList = async (req,res)=>{
  try{
    const check_info = new ICommentListDTO(req.params).CommentSearchOptionInfo;

    for(const prop in check_info)
      if(check_info[prop] === undefined ) throw new CustomError(400,"요청 데이터에 빈 객체가 존재합니다.")

    if(isNaN(check_info["page_index"]) || isNaN(check_info["page_size"]))
      throw new CustomError(400,"정수형 데이터 형식에 올바르지 못한 형식의 데이터가 있습니다.")
    if( check_info["page_index"]<0 || check_info["page_size"]<0)
      throw new CustomError(400,"0이하의 데이터가 들어왔습니다.")

    const search_option = {
      post_id : check_info.post_id,
      start : check_info.page_index,
      size : check_info.page_size
    }

    const list_info = await Post.getCommentListOfPost(search_option);
    if(list_info.err) throw new CustomError(list_info.status,"포스트의 댓글 리스트를 얻는데 실패했습니다.")

    const merged_info = await mergeListUserService(list_info.comment_list);
    if(merged_info.err) throw new CustomError(merged_info.status,"유저정보와 댓글 정보를 합치는데서 에러")

    return res.status(200).json({
      display_comment_list_success: true,
      next_page_index:  list_info.next_page_index,
      comment_list: merged_info.merged_list
    });
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}

module.exports = {
  uploadComment, deleteComment, displayCommentList
}
