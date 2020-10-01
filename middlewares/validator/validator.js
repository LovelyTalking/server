const {
  validateUserRequest, validatePostRequest, validateCommentRequest,validateCorrectionRequest,
  validateMessageRequest
} = require('../../containers/validators/validator.service');
const {ErrorContainer} = require('../../containers/errors/message.error');
const EventEmitter = require('events');

const CustomError = ErrorContainer.get('custom.error');
const errorEvent = new EventEmitter();

errorEvent.on('error',(err,res)=>{
  console.log(err);
  if(err instanceof CustomError) return res.status(err.status).send();
  else return res.status(500).send();
});

const validateUser = async (req,res,next) =>{
  /*
  @desc TODO: 요청으로 들어오는 유저 정보 검증 알고리즘
    1. request method check
    2. validate userinfo using validateUserRequest
  */
  try{
    let user = req.method === 'GET'? req.params : req.body;

    let isValidate = await validateUserRequest(user);
    if(!isValidate) throw new CustomError(400, "요청한 포스트 데이터 객체를 검증하는 과정에서 에러")

    next();
  }catch(err){
    return errorEvent.emit('error', err, res);
  }
}

const validatePost = async(req, res, next)=>{
  try{
    let post = req.method === 'GET'? req.params : req.body;

    let isValidate = await validatePostRequest(post);
    if(!isValidate) throw new CustomError(400, "요청한 포스트 데이터 객체를 검증하는 과정에서 에러");

    next();
  }catch(err){
    return errorEvent.emit('error',err, res);
  }
}

const validateComment = async(req, res, next)=>{
  try{
    let comment = req.method === 'GET'? req.params : req.body;

    let isValidate = await validateCommentRequest(comment);
    if(!isValidate) throw new CustomError(400, "요청한 댓글 데이터 객체를 검증하는 과정에서 에러");

    next();
  }catch(err){
    return errorEvent.emit('error',err, res);
  }
}

const validateCorrection = async(req, res, next)=>{
  try{
    let correction = req.method === 'GET'? req.params : req.body;

    let isValidate = await validateCorrectionRequest(correction);
    if(!isValidate) throw new CustomError(400, "요청한 댓글 데이터 객체를 검증하는 과정에서 에러");

    next();
  }catch(err){
    return errorEvent.emit('error',err, res);
  }
}

const validateMessage = async(req, res, next)=>{
  try{
    let correction = req.method === 'GET'? req.params : req.body;

    let isValidate = await validateMessageRequest(correction);
    if(!isValidate) throw new CustomError(400, "요청한 메시지 데이터 객체를 검증하는 과정에서 에러");

    next();
  }catch(err){
    return errorEvent.emit('error',err, res);
  }
}

module.exports = {
  validateUser, validatePost, validateComment, validateCorrection, validateMessage
}
