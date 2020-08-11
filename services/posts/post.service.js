const { Post } = require('../../models/Post');
const IPostDTO = require('../../interfaces/IPost');
const {ErrorMessageContainer} = require('../../containers/errors/message.error');

const uploadPost = (req, res)=>{
  const postInfo = new IPostDTO(req.body).getUploadPostInfo();
  const post = new Post(postInfo);
  post.save((err,uploaded_post)=>{
    if(err) return sendMongooseErr(err,res);
    if(!uploaded_post)
      return res.status(400).json({ post_upload_success: false, err: "포스트 작성에 실패했습니다."})

    return res.status(200).json({ post_upload_success: true, err: err});
  })
}

const sendMongooseErr = ErrorMessageContainer.get('mongoDB.error')

module.exports = {
  uploadPost
}
