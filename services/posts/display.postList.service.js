const { Post } = require('../../models/Post');
const { IPostDTO, IPostListDTO } = require('../../interfaces/IPost');
const {IUserDTO} = require('../../interfaces/IUser');
const { mergeListUserService }  = require('../../containers/lists/merge');
const {ErrorContainer} = require('../../containers/errors/message.error');

const CustomError = ErrorContainer.get('custom.error');

const checkReqInfo = (checkInfo,res)=>{
  try{
    for(const prop in checkInfo)
      if(checkInfo[prop] === undefined ) throw new CustomError(400,"요청 데이터에 빈 객체가 존재합니다.")

    const search_option = checkInfo;
    const skip = search_option.page_size * search_option.page_index;
    const limit = search_option.page_size;

    return [search_option, skip, limit];
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
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

    const post_list = await Post.find(
      {posted_by:search_option.posted_by, del_ny:false},
      '_id posted_by post_context post_images hashtags register_date annotation_count like_users',
      { sort:'-register_date', skip: skip, limit: limit}
    )
      .populate({
        path:'posted_by',
        match: { del_ny: false},
        select: '_id name email native_language target_language gender profile_image'
      })

    if(!post_list) throw new CustomError(400,"요청 데이터에 맞지 않는 데이터가 있습니다.")

    return res.status(200).json({display_postList_user_success: true, page_index: search_option.page_index, display_info: post_list})

  } catch (err) {
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}


const displayLangRelatedPostList = async(req,res)=>{
  try{
    const checkInfo = new IPostListDTO(req.params).getLangRelatedSearchOptionInfo();

    let search_option ={};
    let skip = 0;
    let limit = 0;
    [search_option, skip, limit] = checkReqInfo(checkInfo,res);

    const post_list = await Post.find(
      { native_language:search_option.native_language,
      target_language:search_option.target_language,
      del_ny:false },
      '_id posted_by post_context post_images hashtags register_date annotation_count like_users',
      { sort:'-register_date',skip: skip, limit: limit}
    )
      .populate({
        path:'posted_by',
        match: { del_ny: false},
        select: '_id name email native_language target_language gender profile_image'
      });

    if(!post_list) throw new CustomError(400,"요청 데이터에 맞지 않는 데이터가 있습니다.")

    return res.status(200).json({display_postList_lang_success: true, page_index: search_option.page_index, display_info: post_list})

  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
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
      '_id posted_by post_context post_images hashtags register_date annotation_count like_users',
      {sort:'-register_date', skip: skip, limit: limit}
    )
      .populate({
        path:'posted_by',
        match: { del_ny: false},
        select: '_id name email native_language target_language gender profile_image'
      });

    if(!post_list) throw new CustomError(400,"요청 데이터에 맞지 않는 데이터가 있습니다.")

    return res.status(200).json({display_postList_hashtag_success: true, page_index: search_option.page_index, display_info: post_list})

  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}

const displayLikeUserlistInPost = async (req, res)=>{
  try{
    const check_info = new IPostListDTO(req.params).getLikeUserRelatedSearchOptionInfo();

    let search_option ={};
    let skip = 0;
    let limit = 0;
    [search_option, skip, limit] = checkReqInfo(check_info,res);

    // @desc limit는 무조건 양수로
    const post = await Post.findById({_id: search_option.post_id})
      .where({del_ny:false})
      .select({like_users: { $slice: [skip, limit] } })
      .populate({
        path:'like_users',
        select: '_id name native_language target_language gender profile_image'
      });
    if(!post) throw new CustomError(400,"요청 데이터에 해당 하는 포스트가 없습니다.")

    const user_list = post.like_users;

    return res.status(200).json({display_like_userList_success:true, page_index: search_option.page_index, display_info: user_list});
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}

module.exports = {
  displayUserRelatedPostList, displayLangRelatedPostList, displayHashtagRelatedPostList,
  displayLikeUserlistInPost
}
