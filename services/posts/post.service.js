const { Post } = require('../../models/Post');
const {IPostDTO} = require('../../interfaces/IPost');
const {IUserDTO} = require('../../interfaces/IUser');
const {ErrorContainer} = require('../../containers/errors/message.error');
const { User} = require('../../models/User');

// @desc 서비스 로직에 필요한 함수 선언
const CustomError = ErrorContainer.get('custom.error')

// @desc 서비스 로직
const uploadPost = (req, res)=>{
  try{
    const checkInfo = new IPostDTO(req.body).getUploadCheck();
    for(const prop in checkInfo)
      if(!checkInfo[prop]) throw new CustomError(400, "업로드할 포스트 내용 일부가 없습니다.")

    const postInfo = new IPostDTO(req.body).getUploadPostInfo();
    postInfo["native_language"] = req.user.native_language;
    postInfo["target_language"] = req.user.target_language;
    postInfo["posted_by"] = req.user._id;

    const user =  req.user;
    const post = new Post(postInfo);
    const saved = post.save(async (err,uploaded_post)=>{
      try{
        if(err) throw new CustomError(500,'포스트 저장에서 에러');
        if(!uploaded_post) throw new CustomError(400,'업로드된 포스트가 없습니다.');

        const populated_post = await Post.findOne({_id: uploaded_post._id}).populate('posted_by');

        const ret_post = new IPostDTO(populated_post).getReturnPostInfo();
        const ret_user = new IUserDTO(populated_post.posted_by).getReturnUserInfo();
        ret_post.posted_by = ret_user;


        return res.status(200).json({ post_upload_success: true, uploaded_post: ret_post});
      }catch(err){
        console.log(err);
        if( err instanceof CustomError) return res.status(err.status).send();
        else return res.status(500).send();
      }
    })

  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}

const displayOnePost = async (req,res)=>{
  try{
    if(!req.params._id) throw new CustomError(400, '요청 데이터 객체가 비어있습니다')

    const found_post = await Post.findById({_id: req.params._id}).where({del_ny:false}).populate('posted_by');
    if(!found_post) throw new CustomError(400, '해당 포스트 아이디로 찾을 수 없습니다.')

    const ret_post = new IPostDTO(found_post).getReturnPostInfo();
    const ret_user = new IUserDTO(found_post.posted_by).getReturnUserInfo();
    ret_post.posted_by = ret_user;

    return res.status(200).json({display_one_post:true, postInfo: ret_post});

  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send('');
    else return res.status(500).send('');
  }
}

const updatePost = async (req, res)=>{
  try{
    const checkInfo = new IPostDTO(req.body).getUpdateCheck();
    for(const prop in checkInfo)
      if(!checkInfo[prop]) throw new CustomError(400,"요청 데이터에 빈 객체가 존재합니다.")

    let postInfo = new IPostDTO(req.body).getUpdatePostInfo();
    if(postInfo.hashtags){
      const hashtag = await Post.findHashtagAndSave(postInfo.hashtags);
      if(hashtag.err) throw new CustomError(hashtag.status, "해시태그 찾기 및 저장에서 에러")
    }


    const update_post = await Post.findById({_id:postInfo._id})
      .where({del_ny:true})
      .populate('posted_by');
    console.log(update_post);
    if(!update_post) throw new CustomError(400, "해당 포스트가 수정되지 않았습니다.")

    await update_post.updateOne({$set:postInfo});
    const ret_post = new IPostDTO(update_post).getReturnPostInfo();
    const ret_user = new IUserDTO(update_post.posted_by).getReturnUserInfo();
    ret_post.posted_by = ret_user;

    return res.status(200).json({update_post_success:true, updated_post : ret_post});

  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}

const deletePost = async (req,res)=>{
  try{
    if(!req.params._id) throw new CustomError(400,"포스트 아이디 데이터가 없습니다.")

    const token = req.cookies.x_pla;
    const {_id: user_id} = await User.findByToken(token, res);

    if(!user_id) throw new CustomError(400,"토큰에 해당하는 유저가 없습니다.")

    const post_id = req.params._id;
    const deleted_post = await Post.findOneAndUpdate({_id:post_id, posted_by: user_id, del_ny:false},{$set :{del_ny:true}},{new:true, runValidators:true}).populate('posted_by');

    if(!deleted_post) throw new CustomError(400,"요청 데이터가 올바르지 않아 제거되지 않았습니다.")

    const ret_post = new IPostDTO(deleted_post).getReturnPostInfo();
    const ret_user = new IUserDTO(deleted_post.posted_by).getReturnUserInfo();
    ret_post.posted_by = ret_user;

    return res.status(200).json({delete_post_success:true, deleted_post: ret_post});
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}

module.exports = {
  uploadPost, displayOnePost, updatePost, deletePost
}
