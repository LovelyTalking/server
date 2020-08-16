const {Post} = require('../../models/Post');
const {ICorrectionDTO} = require('../../interfaces/ICorrection');
const {ErrorMessageContainer} = require('../../containers/errors/message.error');

/*
  @desc TODO: 첨삭기능 3가지
  1) 해당 포스트의 첨삭 작성
  2) 해당 포스트의 첨삭 리스트 조회
  3) 해당 첨삭 제거
*/

const uploadCorrection = async (req, res)=>{
  try{
    req.body["user_id"] = String(req.user._id);
    const correctionDTO = new ICorrectionDTO(req.body);

    const check_info = correctionDTO.getCheckUploadInfo();
    for(const prop in check_info){
      if(!check_info[prop])
        return res.status(400).json({upload_correction_success:false, err:"해당 요청 데이터에 빈 데이터가 있습니다."})
    }

    const upload_info = correctionDTO.getUploadCorrectionInfo();
    const correction_info = await Post.findPostAndPushCorrection(upload_info, res);

    if(correction_info.err)
      return res.status(400).json({
        upload_correction_success:false, err: correction_info.err
      });

    return res.status(200).json({
      upload_correction_success:true,
      uploaded_correction: correction_info.uploaded_correction
    })
  }catch(err){
    return sendMongooseErr(err, res);
  }
}


const deleteCorrection = async (req, res)=>{
  try{
    req.params["user_id"] = String(req.user._id);
    const commentDTO = new ICorrectionDTO(req.params);
    const delete_info = commentDTO.getDeleteCommentInfo();

    for(const prop in delete_info){
      if(!delete_info[prop])
        return res.status(400).json({delete_correction_success:false, err:"해당 요청 데이터에 빈 데이터가 있습니다."})
    }

    const correction_info = await Post.findPostAndDeleteCorrection(delete_info,res);
    if(correction_info.err)
      return res.status(400).json({delete_correction_success:false,
        err: correction_info.err });

    return res.status(200).json({
      delete_correction_success: true,
      deleted_correction: correction_info.deleted_correction
    });
  }catch(err){
    return sendMongooseErr(err, res)
  }
}


// @desc 서비스로직에서 필요한 부품들
const sendMongooseErr = ErrorMessageContainer.get('mongoDB.error');

module.exports = {
  uploadCorrection, deleteCorrection
}
