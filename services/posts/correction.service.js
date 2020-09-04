const {Post} = require('../../models/Post');
const { User} = require('../../models/User');
const {ICorrectionDTO, ICorrectionListDTO} = require('../../interfaces/ICorrection');
const { mergeListUserService }  = require('../../containers/lists/merge');
const {ErrorContainer} = require('../../containers/errors/message.error');

const CustomError = ErrorContainer.get('custom.error');
/*
  @desc TODO: 첨삭기능 3가지
  1) 해당 포스트의 첨삭 작성
  2) 해당 포스트의 첨삭 리스트 조회
  3) 해당 첨삭 제거
*/

const uploadCorrection = async (req, res)=>{
  try{
    req.body["correction_by"] = String(req.user._id);
    const correctionDTO = new ICorrectionDTO(req.body);

    const check_info = correctionDTO.getCheckUploadInfo();
    for(const prop in check_info)
      if(!check_info[prop]) throw new CustomError(400, "해당 요청 데이터에 빈 데이터가 있습니다.")

    const upload_info = correctionDTO.getUploadCorrectionInfo();
    console.log(upload_info);
    const correction_info = await Post.findPostAndPushCorrection(upload_info, res);

    if(correction_info.err) throw new CustomError(correction_info.status, "첨삭을 작성하는 곳에서 에러")

    return res.status(200).json({
      upload_correction_success:true,
      uploaded_correction: correction_info.uploaded_correction
    })
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}


const deleteCorrection = async (req, res)=>{
  try{
    req.params["correction_by"] = String(req.user._id);
    const correctionDTO = new ICorrectionDTO(req.params);
    const delete_info = correctionDTO.getDeleteCorrectionInfo();

    for(const prop in delete_info)
      if(!delete_info[prop]) throw new CustomError(400, "해당 요청 데이터에 빈 데이터가 있습니다.")


    const correction_info = await Post.findPostAndDeleteCorrection(delete_info,res);
    if(correction_info.err) throw new CustomError(correction_info.status, "첨삭을 지우는 곳에서 에러")

    return res.status(200).json({
      delete_correction_success: true,
      deleted_correction: correction_info.deleted_correction
    });
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}

const displayCorrectionList = async (req,res)=>{
  try{
    const check_info = new ICorrectionListDTO(req.params).CorrectionSearchOptionInfo;

    for(const prop in check_info)
      if(check_info[prop] === undefined ) throw new CustomError(400,"요청 데이터에 빈 객체가 존재합니다.")

    const search_option = {
      post_id : check_info.post_id,
      start : check_info.page_index,
      size : check_info.page_size
    }

    const list_info = await Post.getCorrectionListOfPost(search_option);
    if(list_info.err) throw new CustomError(list_info.status,"포스트의 첨삭 리스트를 얻는데 실패했습니다.")

    return res.status(200).json({
      display_correction_list_success: true,
      next_page_index:  list_info.next_page_index,
      correction_list: list_info.correction_list
    });
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}


module.exports = {
  uploadCorrection, deleteCorrection, displayCorrectionList
}
