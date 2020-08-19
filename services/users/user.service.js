const {User} = require('../../models/User')
const {IUserDTO} = require('../../interfaces/IUser');
const authMailConfig = require('../../configs/nodemailer');
const {ErrorContainer} = require('../../containers/errors/message.error');
const _ = require('lodash');

const registerUser = (req, res)=>{

    const userInfo = new IUserDTO(req.body).getRegisterUserInfo();
    const user = new User(userInfo);

    const saved = user.save((err,user_info)=>{
      try{
        if(err) throw Error(err);

        authMailConfig(req, user);

        return res.status(200).json({
          register_success: true,
          register_auth : false
        });
      }catch(err){
        console.log(err);
        if( err instanceof CustomError) return res.status(err.status).send();
        else return res.status(500).send();
      }
    });
}

const checkDuplicateEmailName = async (req, res)=>{
  try{
    if(!req.params.email) throw new CustomError(400, "empty email object");

    const found_user = await User.findOne({email:req.params.email});

    if(!found_user)
      return res.status(200).json({
        check_email_id:true,
        err: null
      })

    return res.status(200).json({
      check_email_id: false,
      err: "this email name is existed in DB"
    })

  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else  return res.status(500).send();
  }
}

const checkVerifyAuthEmail = async (req,res)=>{
  try {
    const verified_email = await User.updateOne({auth_email_key:req.query.key},{$set:{auth_email_verified:true,runValidators:true}});

    if(!verified_email) throw new CustomError(400, "해당 이메일정보가 정확하지 않습니다.")
  } catch (err) {
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}

const loginUser = async (req,res)=>{
  try{
    if(!req.body.email) throw new CustomError(400, "요청 데이터 객체가 비어있습니다");

    const found_user = await User.findOne({email:req.body.email, del_ny: false});
    if(!found_user) throw new CustomeError(400,"해당 유저를 찾을 수 없습니다.");

    const compared_password = await found_user.comparePassword(req.body.password);
    if(compared_password.err) throw new CustomError(compared_password.status, "비밀번호 비교하는 곳에 에러")

    if(!compared_password.isMatch)
      return res.status(200).json({
        login_success: false,
        err: "매치 되는 비밀번호가 없습니다."
      });

    const generated_token = await found_user.generateToken();
    if(generated_token.err) throw new CustomError(generated_token.status, "토큰을 생성하면서 에러")
    const user_with_token = generated_token.saved_user;

    res.cookie("x_pla", user_with_token.token, {maxAge: 60000 * 60 * 24, httpOnly: true, secure:false})
      .status(200)
      .json({
        login_success: true,
        user_id: user_with_token._id
      });
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else  return res.status(500).send();
  }
}

const sendIsAuth = async (req,res)=>{
  try{
    if(!req.user) throw new Custom(400, "인증된 유저가 아닙니다");

    const user = new IUserDTO(req.user).getAuthInfo();

    res.status(200).json(user);
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else  return res.status(500).send();
  }
}

const uploadProfileImage = async (req,res)=>{
  try{
    const updateInfo = new IUserDTO(req.body).getUploadImageInfo();

    if(!updateInfo._id || !updateInfo.profile_image)
      throw new CustomError(400, "요청 데이터에 정보가 빈 데이터가 있습니다.")

    const uploaded_image = await User.findOneAndUpdate({_id: updateInfo._id},{$set : { profile_image: updateInfo.profile_image, update_date : updateInfo.update_date }}, {new :true,runValidators:true});

    if(!uploaded_image) throw new CustomError(400, "요청한 계정정보에 해당하는 계정정보가 없습니다.");

    return res.status(200).json({
      upload_profileImage_success : true,
      err: null
    })
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else  return res.status(500).send();
  }
}

const uploadProfileText = async (req,res)=>{
  try{
    const updateInfo = new IUserDTO(req.body).getUploadTextInfo() ;

    if(!updateInfo._id || !updateInfo.profile_text)
      throw new CustomError(400, "요청 데이터에 정보가 빈 데이터가 있습니다.")

    const updated_text = await User.findOneAndUpdate({_id: updateInfo._id},{$set : { profile_text: updateInfo.profile_text, update_date : updateInfo.update_date }}, {new :true,runValidators:true});

    if(!updated_text) throw new CustomError(400, "요청한 계정정보에 해당하는 계정정보가 없습니다.");

    return res.status(200).json({
      upload_profileText_success : true,
      err: null
    })
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else  return res.status(500).send();
  }
}

const updateUserInfo = async (req,res)=>{
  try{
    const updateInfo = new IUserDTO(req.body).getUpdateUserInfo() ;

    for (const prop in updateInfo)
      if(!updateInfo[prop]) throw new CustomError(400,"요청 데이터에 빈 객체가 존재합니다.")

    let updateInputObj = _.cloneDeep(updateInfo);
    delete updateInputObj['_id'];

    const updated_user = await User.findOneAndUpdate({_id: updateInfo._id},{$set : updateInputObj}, {new :true,runValidators:true});

    if(!updated_user) throw new CustomError(400, "요청한 계정정보에 해당하는 계정정보가 없습니다.")

    return res.status(200).json({
      update_user_success : true,
      err: null
    })
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}

const logoutUser = async (req,res)=>{
  try{
    if(!req.cookies.x_pla) throw new CustomError(400, "쿠키 정보가 없습니다.")

    const updated_user = await User.findOneAndUpdate({token : req.cookies.x_pla}, {$set : {token: ""}}, {new: true,runValidators:true});

    if(!updated_user) throw new CustomError(400, "토큰에 해당하는 유저가 없습니다.")

    return res.status(200).clearCookie('x_pla').json({
      logout_success: true,
      err: null
    })
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}

const confirmUserPassword = async (req,res)=>{
  try{
    if(!req.body._id || !req.body.password)
      throw new CustomError(400,"요청 데이터에 빈 객체가 존재합니다.")

    const found_user = await User.findById({_id: req.body._id});
    if(!found_user) throw new CustomError(400,"해당 id에 일치하는 유저 정보가 없습니다")

    const compared_password = await found_user.comparePassword(req.body.password);
    if(compared_password.err) throw new CustomError(compared_password.status, "비밀번호 비교하는 곳에 에러")

    if(!compared_password.isMatch)
      return res.status(200).json({
        confirm_password_success: false,
        err: "검색된 유저의 비밀번호와 일치하지 않습니다."
      });

    return res.status(200).json({
      confirm_password_success: true,
      err: null
    })
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}

const updateUserPassword = async (req,res)=>{
  try{
    const update_info = new IUserDTO(req.body).getUpdateUserPasswordInfo();
    update_info.new_password = req.body.new_password;

    for (const prop in update_info)
      if(!update_info[prop]) throw new CustomError(400,"요청 데이터에 빈 객체가 존재합니다.")

    if(update_info.password === update_info.new_password)
      throw new CustomError(400,"현재 비밀번호와 바꿀 비밀번호가 같은 비밀번호입니다.")

    const found_user = await User.findOne({_id: update_info._id});
    if(!found_user) throw new CustomError(400,"해당 하는 id에 유효한 유저가 없습니다.")

    const compared_password = await found_user.comparePassword(update_info.password);
    if(compared_password.err) throw new CustomError(compared_password.status, "비밀번호 비교하는 곳에 에러")

    if(!compared_password.isMatch)
      return res.status(200).json({
        update_password_success: false,
        err: "해당 유저에 맞지 않는 현재 비밀번호를 입력했습니다."
      });

    const updated_password = await found_user.updatePassword(update_info.new_password, update_info.update_date);

    if(updated_password.err) throw new CustomError(updated_password.status, "패스워드 업데이트에서 에러")
    if(!updated_password.updated_user) throw new CustomError(400,"업데이트된 유저 정보가 없습니다.");

    return res.status(200).json({
      update_password_success: true,
      err: null
    })
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}

const deleteUser = async (req,res)=>{
  try{
    let delete_info = new IUserDTO(req.body).getDeleteUserInfo();

    if(!delete_info._id) throw new CustomError(400, "요청 데이터의 유저id가 비어있습니다.")

    const deleted_user = await User.findOneAndUpdate({_id:delete_info._id, del_ny:false}, {$set : delete_info},{new:true,runValidators:true});

    if(!deleted_user) throw new CustomError(400, "삭제된 유저 정보가 없습니다.");

    return res.status(200).json({ delete_user_success: true, err: null});
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}

const displayOneUser = async (req, res)=>{
  res.send("hello");
}

const displayUserList = async (req, res)=>{

}

const CustomError = ErrorContainer.get('custom.error')

module.exports = {
  registerUser,
  checkDuplicateEmailName,
  checkVerifyAuthEmail,
  loginUser,
  logoutUser,
  sendIsAuth,
  uploadProfileImage,
  uploadProfileText,
  updateUserInfo,
  confirmUserPassword,
  updateUserPassword,
  deleteUser,
  displayOneUser,
  displayUserList
}
