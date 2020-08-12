const { Post } = require('../../models/Post');
const IPostDTO = require('../../interfaces/IPost');
const {ErrorMessageContainer} = require('../../containers/errors/message.error');


const uploadPost = (req, res)=>{
  const checkInfo = new IPostDTO(req.body).getUploadCheck();
  for(const prop in checkInfo){
    if(!checkInfo[prop])
      return res.status(400).json({"post_upload_success":false, "err":"업로드할 포스트 내용 일부가 없습니다."})
  }

  const postInfo = new IPostDTO(req.body).getUploadPostInfo();
  const post = new Post(postInfo);
  post.save((err,uploaded_post)=>{
    if(err) return sendMongooseErr(err,res);
    if(!uploaded_post)
      return res.status(400).json({ post_upload_success: false, err: "포스트 작성에 실패했습니다."})

    return res.status(200).json({ post_upload_success: true, err: err});
  })
}

const displayOnePost = async (req,res)=>{
  try{
    if(!req.params._id)
      return res.status(400).json({display_one_post: false, err: "포스트 아이디가 비어있습니다."});

    const found_post = await Post.findOne({_id: req.params._id});

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

    const updated_post = await Post.updateOne({_id:postInfo._id},{$set:postInfo},{new:true});

    if(!updated_post)
      return res.status(400).json({update_post_success: false, err:"해당 포스트가 수정되지 않았습니다."})

    return res.status(200).json({display_one_post:true, postInfo});
  }catch(err){
    sendMongooseErr(err,res);
  }
}

const sendMongooseErr = ErrorMessageContainer.get('mongoDB.error')

module.exports = {
  uploadPost, displayOnePost, updatePost
}
