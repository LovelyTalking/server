
const Container = require('typedi').Container;
const Service = require('typedi').Service;
const{ErrorContainer} = require('../errors/message.error');
const assert = require('assert');
const validator = require('validator');

let CustomError = ErrorContainer.get('custom.error');

let ValidateMongoID = Service(()=>({

  check(id){
    try{
      //@desc check user id 12byte , is Hex
      return validator.isMongoId(id);
    }catch(err){
      console.log(err);
      return false;
    }
  }
}))

let ValidateUserName = Service(()=>({
  check(name){
    try{
      return validator.isLength(name,{min:2,max:100}) && /(?=(^[^\s]).*([^\s]$))(?![^a-zA-Z0-9\v])/.test(name)
    }catch(err){
      console.log(err);
      return false;
    }
  }
}))

let ValidateEmail = Service(()=>({

  check(email){
    try{
      //@desc check isEmail
      return validator.isEmail(email);
    }catch(err){
      console.log(err);
      return false;
    }
  }
}))

let ValidatePassword = Service(()=>({

  check(password){
    try{
      return ( /(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~!@#$%^&*|\\\'\";:\/?])(?!.*[^a-zA-Z0-9~!@#$%^&*|\\\'\";:\/?])/.test(password) ) && (validator.isLength(password,{ min:8, max:50}));

    }catch(err){
      console.log(err);
      return false;
    }
  }
}))

let ValidateLang = Service(()=>({

  check(lang){
    const nation_lang_codes = ['AR','BG','HR','CS','DA','DE','EL','EN','ET','ES','FI','FR','GA','HI','HU','HE','IT','JA','KO','LV','LT','NL','NO','PL','PT','SV','RO','RU','SR','SK','SL','TH','TR','UK','ZH']

    try{
      //@desc check language style in nation_lang_codes
      return validator.isIn(lang, nation_lang_codes);
    }catch(err){
      console.log(err);
      return false;
    }
  }
}))

let ValidateGender = Service(()=>({

  check(gender){
    try{
      //@desc check user id 12byte
      return gender === 'M' || gender === 'F'
    }catch(err){
      console.log(err);
      return false;
    }
  }
}))

let ValidateImage = Service(()=>({

  check(image){
    try{
      //@desc check image length, file extension
      return /.*(\.png|\.jpg|\.bmp|\.gif|\.jpeg|\.svg)$/ig.test(image) && validator.isLength(image, {min:5, max:200});
    }catch(err){
      console.log(err);
      return false;
    }
  }
}))

let ValidateText = Service(()=>({

  check(text, size){
    try{
      //@desc check Context length
      return validator.isLength(text, {max:size});
    }catch(err){
      console.log(err);
      return false;
    }
  }
}))

let ValidateInteger = Service(()=>({

  check(num){
    try{
      //@desc check page_index isNumber, size > 0, if typeof num is integer, string(num)
      num = String(num);
      return validator.isInt(num, {gt:-1});
    }catch(err){
      console.log(err);
      return false;
    }
  }
}))

let ValidateArrayLength = Service(()=>({

  check(limit, size){
    try{
      return size >= 0 && limit >= size;
    }catch(err){
      console.log(err);
      return false;
    }
  }
}))

let ValidateElementDuplicate = Service(()=>({

  check(arr){
    try{
      let check_set = new Set(arr);

      return check_set.size === arr.length;
    }catch(err){
      console.log(err);
      return false;
    }
  }
}))

let ValidateHashtag = Service(()=>({

  check(hashtag){
    try{
      return /(?=^[#])(?!.*[^a-zA-Z0-9\S])/.test(hashtag) && validator.isLength(hashtag,{min:2, max:30})
    }catch(err){
      console.log(err);
      return false;
    }
  }
}))

let ValidateBoolean = Service(()=>({

  check(is_bool){
    try{
      return (typeof is_bool === "boolean")
    }catch(err){
      console.log(err);
      return false;
    }
  }
}))

//ValidateUserID ValidateEmail ValidatePassword ValidateLang ValidateGender ValidateProfileImage ValidateProfileContext
const UserValidationService = Service([
  ValidateMongoID, ValidateEmail, ValidatePassword,
  ValidateLang, ValidateGender, ValidateImage, ValidateText,
  ValidateInteger, ValidateUserName
], (mongoID, email, password, lang, gender, profile_image, profile_text, integer, name)=>{
  const validateUserRequestInfo = function(user){
    try{
      if(user.hasOwnProperty('_id') && !mongoID.check(user._id))
        throw "user_id is invalid"

      if(user.hasOwnProperty('email') && !email.check(user.email))
        throw "email is invalid"

      if(user.hasOwnProperty('name') && !name.check(user.name))
        throw "user name is invalid"

      if(user.hasOwnProperty('password') && !password.check(user.password))
        throw "password is invalid"

      if(user.hasOwnProperty('native_language') && !lang.check(user.native_language))
        throw "native_language is invalid"

      if(user.hasOwnProperty('target_language') && !lang.check(user.target_language))
        throw "target_language is invalid"

      if(user.hasOwnProperty('gender') && !gender.check(user.gender))
        throw "gender is invalid"

      if(user.hasOwnProperty('profile_image') && !profile_image.check(user.profile_image))
        throw "profile_image is invalid"

      if(user.hasOwnProperty('profile_text') && !profile_text.check(user.profile_text,3000))
        throw "profile_text is invalid"

      if(user.hasOwnProperty('page_index') && !integer.check(user.page_index))
        throw "page_index is invalid"

      if(user.hasOwnProperty('page_size') && !integer.check(user.page_size))
        throw "page_size is invalid"

      return true;
    }catch(err){
      console.log(err);
      return false;
    }
  }

  return validateUserRequestInfo;
})

const PostValidationService = Service([
  ValidateMongoID, ValidateLang, ValidateImage, ValidateText,
  ValidateInteger, ValidateArrayLength, ValidateHashtag,
  ValidateElementDuplicate
], (mongoID, lang, post_image, post_context, integer, array_len, hashtag, array_dup)=>{
  const validatePostRequestInfo = function(post){
    try{
      if(post.hasOwnProperty('_id') && !mongoID.check(post._id))
        throw "post_id is invalid"

      if(post.hasOwnProperty('user_id') && !mongoID.check(post.user_id))
        throw "user_id is invalid"

      if(post.hasOwnProperty('native_language') && !lang.check(post.native_language))
        throw "native_language is invalid"

      if(post.hasOwnProperty('target_language') && !lang.check(post.target_language))
        throw "target_language is invalid"

      if(post.hasOwnProperty('post_context') && !post_context.check(post.post_context, 3000))
        throw "target_language is invalid"

      if(post.hasOwnProperty('post_images')){
        if(!array_len.check(6, post.post_images.length))
          throw "post_images length is invalid"

        if(!array_dup.check(post.post_images))
          throw "post_images element duplicate check is invalid"

        post.post_images.some(image=>{
          if(!post_image.check(image)) throw "image is invalid"
        })
      }


      if(post.hasOwnProperty('hashtags')){
        if(!array_len.check(15, post.hashtags.length))
          throw "hashtags length is invalid"

        post.hashtags.forEach(tag=>{
          if(!hashtag.check(tag)) throw "hashtag is invalid"
        })
      }

      if(post.hasOwnProperty('hashtag_name') && !hashtag.check(post.hashtag_name))
        throw "hashtag_name is invalid"

      if(post.hasOwnProperty('page_index') && !integer.check(post.page_index))
        throw "page_index is invalid"

      if(post.hasOwnProperty('page_size') && !integer.check(post.page_size))
        throw "page_size is invalid"

      return true;
    }catch(err){
      console.log(err);
      return false;
    }
  }

  return validatePostRequestInfo;
})

const CommentValidationService = Service([
  ValidateMongoID, ValidateText, ValidateInteger
], (mongoID, comment_context , integer)=>{
  const validateCommentRequestInfo = function(comment){
    try{
      if(comment.hasOwnProperty('_id') && !mongoID.check(comment._id))
        throw "comment_id is invalid"

      if(comment.hasOwnProperty('post_id') && !mongoID.check(comment.post_id))
        throw "post_id is invalid"

      if(comment.hasOwnProperty('page_index') && !integer.check(comment.page_index))
        throw "page_index is invalid"

      if(comment.hasOwnProperty('page_size') && !integer.check(comment.page_size))
        throw "page_size is invalid"

      if(comment.hasOwnProperty('comment_context') && !comment_context.check(comment.comment_context,500))
        throw "comment_context is invalid"

      return true;
    }catch(err){
      console.log(err);
      return false;
    }
  }

  return validateCommentRequestInfo;
})

const CorrectionValidationService = Service([
  ValidateMongoID, ValidateText, ValidateInteger, ValidateArrayLength,
  ValidateElementDuplicate, ValidateBoolean
], (mongoID, text , integer, array_len, array_dup, is_bool )=>{
  const validateCorrectionRequestInfo = function(correction){
    try{
      if(correction.hasOwnProperty('_id') && !mongoID.check(correction._id))
        throw "correction_id is invalid"

      if(correction.hasOwnProperty('post_id') && !mongoID.check(correction.post_id))
        throw "post_id is invalid"

      if(correction.hasOwnProperty('page_index') && !integer.check(correction.page_index))
        throw "page_index is invalid"

      if(correction.hasOwnProperty('page_size') && !integer.check(correction.page_size))
        throw "page_size is invalid"

      if(correction.hasOwnProperty('correction_context'))
        correction.correction_context.some(context=>{
          if(!text.check(context.text,1000) || !is_bool.check(context.modified)) throw "correction_context is invalid"
        })


      if(correction.hasOwnProperty('additional_text') && !text.check(correction.additional_text,2000))
        throw "additional_text is invalid"

      return true;
    }catch(err){
      console.log(err);
      return false;
    }
  }

  return validateCorrectionRequestInfo;
})

const MessageValidationService = Service([
  ValidateMongoID, ValidateText, ValidateInteger
], (mongoID, text , integer)=>{
  const validateMessageRequestInfo = function(message){
    try{
      if(message.hasOwnProperty('room_info') && !mongoID.check(message.room_info))
        throw "room_info is invalid"

      if(message.hasOwnProperty('user_id') && !mongoID.check(message.user_id))
        throw "user_id is invalid"

      if(message.hasOwnProperty('page_index') && !integer.check(message.page_index))
        throw "page_index is invalid"

      if(message.hasOwnProperty('page_size') && !integer.check(message.page_size))
        throw "page_size is invalid"

      if(message.hasOwnProperty('message') && !text.check(message.text))
        throw "message text is invalid"

      return true;
    }catch(err){
      console.log(err);
      return false;
    }
  }

  return validateMessageRequestInfo;
})


const validateUserRequest = Container.get(UserValidationService);
const validatePostRequest = Container.get(PostValidationService);
const validateCommentRequest = Container.get(CommentValidationService);
const validateCorrectionRequest = Container.get(CorrectionValidationService);
const validateMessageRequest = Container.get(MessageValidationService);

module.exports ={
  validateUserRequest, validatePostRequest, validateCommentRequest,
  validateCorrectionRequest, validateMessageRequest
}
