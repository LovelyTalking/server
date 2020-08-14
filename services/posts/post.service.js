const { Post } = require('../../models/Post');
const {IPostDTO} = require('../../interfaces/IPost');
const {ErrorMessageContainer} = require('../../containers/errors/message.error');
const { User} = require('../../models/User');

// @desc 서비스 로직에 필요한 함수 선언
const sendMongooseErr = ErrorMessageContainer.get('mongoDB.error')

// @desc 서비스 로직
const uploadPost = (req, res)=>{

  const checkInfo = new IPostDTO(req.body).getUploadCheck();
  for(const prop in checkInfo){
    if(!checkInfo[prop])
      return res.status(400).json({post_upload_success:false, err:"업로드할 포스트 내용 일부가 없습니다."})
  }

  const postInfo = new IPostDTO(req.body).getUploadPostInfo();
  console.log(req.user.native_language);
  postInfo["native_language"] = req.user.native_language;
  postInfo["target_language"] = req.user.target_language;
  postInfo["user_id"] = req.user._id;
  const post = new Post(postInfo);
  post.save((err,uploaded_post)=>{
    if(err)
      return sendMongooseErr(err,res);
      
    if(!uploaded_post)
      return res.status(400).json({ post_upload_success: false, err: "포스트 작성에 실패했습니다."})

    return res.status(200).json({ post_upload_success: true, uploaded_post});
  })
}

const displayOnePost = async (req,res)=>{
  try{
    if(!req.params._id)
      return res.status(400).json({display_one_post: false, err: "포스트 아이디가 비어있습니다."});

    const found_post = await Post.findOne({_id: req.params._id, del_ny: false});

    if(!found_post)
      return res.status(400).json({display_one_post:false, err:"해당 포스트 아이디로 찾을 수 없습니다."})

    const postInfo = new IPostDTO(found_post).getOnePostInfo();
    return res.status(200).json({display_one_post:true, postInfo});

  }catch(err){
    return sendMongooseErr(err,res);
  }
}

const updatePost = async (req, res)=>{
  try{
    const checkInfo = new IPostDTO(req.body).getUpdateCheck();
    for(const prop in checkInfo){
      if(!checkInfo[prop])
        return res.status(400).json({update_post_success: false, err:"해당 요청에 비어있는 데이터가 있습니다."});
    }

    let postInfo = new IPostDTO(req.body).getUpdatePostInfo();
    if(postInfo.hashtags)
        await Post.findHashtagAndSave(postInfo.hashtags,res);

    const updated_post = await Post.updateOne({_id:postInfo._id, del_ny: false},{$set:postInfo},{new:true, runValidators : true});

    if(!updated_post)
      return res.status(400).json({update_post_success: false, err:"해당 포스트가 수정되지 않았습니다."})

    return res.status(200).json({update_post_success:true, updated_post});
  }catch(err){
    return sendMongooseErr(err,res);
  }
}

const deletePost = async (req,res)=>{
  try{
    if(!req.cookies.x_pla)
      return res.status(400).json({delete_post_success: false, err : "인증되지 않은 유저입니다."})

    if(!req.params._id)
      return res.status(400).json({delete_post_success: false, err: "포스트 아이디 데이터가 없습니다."})

    const token = req.cookies.x_pla;
    const {_id: user_id} = await User.findByToken(token, res);

    if(!user_id)
      return res.status(400).json({delete_post_success:false, err:"토큰에 해당하는 유저가 없습니다."});

    const post_id = req.params._id;
    const deleted_post = await Post.findOneAndUpdate({_id:post_id, user_id: user_id, del_ny:false},{$set :{del_ny:true}},{new:true, runValidators:true});

    if(!deleted_post)
      return res.status(400).json({delete_post_success:false, err:"요청 데이터가 정확하지 않아 제거되지 않았습니다."});

    return res.status(200).json({delete_post_success:true, err: null});
  }catch(err){
    return sendMongooseErr(err,res);
  }
}

module.exports = {
  uploadPost, displayOnePost, updatePost, deletePost
}
