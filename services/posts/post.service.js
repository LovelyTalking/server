const { Post } = require('../../models/Post');
const { IPostDTO }  = require('../../interfaces/IPost');
const {ErrorMessageContainer} = require('../../containers/errors/message.error');

const uploadPost = (req, res)=>{
  const postInfo = new IPostDTO(req.body).getUploadPostInfo();
  const post = new Post(postInfo);
  post.save((err,uploaded_post)=>{
    if(err) sendMongooseErr(err,res);

    return res.json({});
  })
}

const sendMongooseErr = ErrorMessageContainer.get('mongoDB.error')

module.exports = { uploadPost }
