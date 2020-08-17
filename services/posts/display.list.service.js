const { Post } = require('../../models/Post');
const { IPostDTO, IPostListDTO } = require('../../interfaces/IPost');
const {ErrorMessageContainer} = require('../../containers/errors/message.error');
const { mergeListUserService }  = require('../../containers/lists/merge');

const sendMongooseErr = ErrorMessageContainer.get('mongoDB.error');

const checkReqInfo = (checkInfo,res)=>{
  for(const prop in checkInfo){
    if(checkInfo[prop] === undefined )
      return res.status(400).json({ display_postList_success: false, err: "요청 데이터에 필요한 데이터가 비어있습니다."})
  }
  if(isNaN(checkInfo["page_index"]) || isNaN(checkInfo["page_size"])){
    return res.status(400).json({ display_postList_success: false, err: "정수형 데이터 형식에 올바르지 못한 형식의 데이터가 있습니다."})
  }

  const search_option = checkInfo;
  const skip = search_option.page_size * search_option.page_index;
  const limit = search_option.page_size;

  return [search_option, skip, limit];
}
// @desc 요청으로 들어올 데이터: _id , page_index, page_size
//       skip: page_index*page_size, limit: page_size
const displayUserRelatedPostList = async (req,res)=>{
  try {
    const checkInfo = new IPostListDTO(req.params).getUserRelatedSearchOptionInfo();

    let search_option ={};
    let skip = 0;
    let limit = 0;
    [search_option, skip, limit] = checkReqInfo(checkInfo,res);

    const post_list = await Post.find({user_id:search_option.user_id, del_ny:false},'_id user_id post_context post_images hashtags',{ skip: skip, limit: limit})

    if(!post_list)
      return res.status(400).json({display_postList_user_success: true, page_index: search_option.page_index, note: "요청 데이터에 맞지 않는 데이터가 있습니다."})


    const return_list = await mergeListUserService(post_list);
    if(return_list.err) res.status(400).json({display_postList_user_success:false, err: err});

    return res.status(200).json({display_postList_user_success: true, page_index: search_option.page_index, display_info: return_list.merged_list})

  } catch (err) {
    return sendMongooseErr(err,res);
  }
}


const displayLangRelatedPostList = async(req,res)=>{
  try{
    const checkInfo = new IPostListDTO(req.params).getLangRelatedSearchOptionInfo();

    let search_option ={};
    let skip = 0;
    let limit = 0;
    [search_option, skip, limit] = checkReqInfo(checkInfo,res);

    const post_list = await Post.find({
      native_language:search_option.native_language,
      target_language:search_option.target_language,
      del_ny:false
    },'_id user_id post_context post_images hashtags',{ skip: skip, limit: limit});

    if(!post_list)
      return res.status(400).json({display_postList_lang_success: true, page_index: search_option.page_index, note: "요청 데이터에 맞지 않는 데이터가 있습니다."})

    const return_list = await mergeListUserService(post_list);
    if(return_list.err) res.status(400).json({display_postList_lang_success:false, err: err});

    return res.status(200).json({display_postList_lang_success: true, page_index: search_option.page_index, display_info: return_list.merged_list})

  }catch(err){
    return sendMongooseErr(err, res);
  }
}

const displayHashtagRelatedPostList = async (req, res)=>{
  try{
    req.params["native_language"] = req.user.native_language;
    req.params["target_language"] = req.user.target_language;
    const checkInfo = new IPostListDTO(req.params).getHashtagRelatedSearchOptionInfo();

    let search_option ={};
    let skip = 0;
    let limit = 0;
    [search_option, skip, limit] = checkReqInfo(checkInfo,res);

    const post_list = await Post.find(
      {
        hashtags: {$in : search_option.hashtag_name},
        native_language: search_option.native_language,
        target_language: search_option.target_language,
        del_ny: false
      },
      '_id user_id post_context post_images hashtags',
      {skip: skip, limit: limit}
    );

    if(!post_list)
      return res.status(400).json({display_postList_hashtag_success: true, page_index: search_option.page_index, note: "요청 데이터에 맞지 않는 데이터가 있습니다."})

    const return_list = await mergeListUserService(post_list);
    if(return_list.err) res.status(400).json({display_postList_hashtag_success:false, err: err});

    return res.status(200).json({display_postList_hashtag_success: true, page_index: search_option.page_index, display_info: return_list.merged_list})

  }catch(err){
    return sendMongooseErr(err, ser);
  }
}

module.exports = {
  displayUserRelatedPostList, displayLangRelatedPostList, displayHashtagRelatedPostList
}
