const { Room } = require('../../models/Room');
const { UserStateInRoom } = require('../../models/UserState');
const { Message }  = require('../../models/Message');
const { IRoomDTO } = require('../../interfaces/IRoom');
const { IUserStateInRoomDTO} = require('../../interfaces/IUserState');
const { IMessageDTO} = require('../../interfaces/IMessage')
const mongoose_type = require('mongoose').Types;
const {ErrorContainer} = require('../../containers/errors/message.error');

const CustomError = ErrorContainer.get('custom.error');



const displayRoomList = async(req, res)=>{
  try{
    let user_id = req.user._id;

    let check_info = { user_id, page_index: req.params.page_index, page_size: req.params.page_size };
    const [search_option, skip, limit] = checkReqInfo(check_info, res);

    user_id = mongoose_type.ObjectId(search_option.user_id);

    const {err, room_list} = await Room.findRoomListIncludedMyUserInfo(search_option, skip, limit);
    if(err) throw new CustomError(err.status || 500, "룸 리스트 조회 모델함수에서 에러");

    return res.status(200).json({ display_room_list_success: true, room_list});
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send('');
    else return res.status(500).send('');
  }
}

const createMessageRoom = async(req, res)=>{
  try{
    const my_user_id = mongoose_type.ObjectId(req.user._id);
    const other_user_id = mongoose_type.ObjectId(req.params.user_id);

    const {err,created_room} = await Room.createRoomAndUserState([my_user_id,other_user_id]);
    if(err) throw new CustomError(err.status || 500,"메신저 룸을 생성하는 모델함수에서 에러");

    return res.status(200).json({create_room_success:true, created_room});
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send('');
    else return res.status(500).send('');
  }
}

const enterMessageRoom = async (req, res)=>{
  try{
    const room_id = mongoose_type.ObjectId(req.params.room_info);
    const other_user = mongoose_type.ObjectId(req.params.user_id);
    const my_user= mongoose_type.ObjectId(req.user._id);

    const {err} = await Room.findRoomAndUserState({room_id, other_user, my_user});
    if(err) throw new CustomError(err.status || 500,"룸과 유저상태 정보를 검색하는  모델함수에서 에러");

    const message_list = await Message.find(
      {room_info:room_id},
      "_id send_by message register_date",
      {sort: '-register_date',limit:5}
    );

    return res.status(200).json({ enter_room_success: true, message_list});
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send('');
    else return res.status(500).send('');
  }
}

const displayMessageList = async (req,res)=>{
  try{
    const room_info = mongoose_type.ObjectId(req.params.room_info);
    let skip=0;
    let limit = 0;
    let check_info = { room_info, page_index: req.params.page_index, page_size: req.params.page_size };
    [check_info, skip, limit] = await checkReqInfo(check_info);

    const message_list = await Message.find(
      {room_info:room_info, del_ny: false},
      "_id send_by message register_date",
      {sort:'-register_date',skip:skip, limit: limit}
    )

    return res.status(200).json({ display_message_list_success: true, message_list});
  }catch(err){
    console.log(err);
    if(err instanceof CustomError) return res.status(err.stats).send('');
    else return res.status(500).send('');
  }
}


const sendMessageInRoom = async(req,res)=>{
  try{
    req.body["send_by"]= req.user._id;
    const message_info = new IMessageDTO(req.body).getSendMessageInfo();

    const {err} = await Room.updateRoomAndUserStateBeforeSendingMessage(message_info);
    if(err) throw new (err.status || 500, "메시지 전송에 필요한 메신저 룸 및 유저상태 업데이트 모델 함수에서 에러");

    const message = new Message(message_info);
    if(!message) throw new CustomError(400,"해당 요청 메시지의 데이터 구성이 올바르지 않습니다.")

    req.app.get('io').of('/message').to(message_info.room_info).emit('message', message);
    await message.save();
    return res.status(200).json({send_message_success: true});

  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send('');
    else return res.status(500).send('');
  }
}


const deleteMessage = async(req, res)=>{
  try{
    const _id = mongoose_type.ObjectId(req.params._id);
    const send_by = mongoose_type.ObjectId(req.user._id);
    const {del_ny, delete_date, ...etc} = new IMessageDTO({_id, send_by}).getDeleteMessageInfo();

    const deleted_msg = await Message.findOneAndUpdate(
      {_id:_id, send_by:send_by},
      {$set: {del_ny:del_ny, delete_date:delete_date}},
      {new:true, runValidators:true}
    );
    if(!deleted_msg) throw new CustomError(400,"메시지를 요청하는 데이터가 올바르지 않습니다.");

    return res.status(200).json({delete_message_success: true});

  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send('');
    else return res.status(500).send('');
  }
}


const deleteMessageRoom = async(req, res)=>{
  try{
      const room_id = mongoose_type.ObjectId(req.params.room_info);
      const user_id = mongoose_type.ObjectId(req.user._id);

      const room = await Room.findOne({_id:room_id, users:user_id});
      if(!room) throw new CustomError(400, "요청한 데이터에 해당하는 룸 정보가 없습니다.");

      const user_state = await UserStateInRoom.findOne({room_info:room_id, user_info:user_id, is_out:false});
      if(!user_state) throw new CustomError(400, "요청한 데이터에 해당하는 유저 상태가 없거나 이미 해당 방을 나간 유저입니다.");

      user_state.is_out = true;
      user_state.room_out_date = moment().format();
      await user_state.save();

      return res.status(200).json({delete_room_success: true});
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send('');
    else return res.status(500).send('');
  }
}

module.exports = {
  displayRoomList, createMessageRoom, enterMessageRoom, displayMessageList,
   sendMessageInRoom, deleteMessageRoom, deleteMessage
}

const checkReqInfo = (checkInfo,res)=>{
  try{
    for(const prop in checkInfo)
      if(checkInfo[prop] === undefined ) throw new CustomError(400,"요청 데이터에 빈 객체가 존재합니다.")

    const search_option = checkInfo;
    const skip = Number(search_option.page_size * search_option.page_index);
    const limit = Number(search_option.page_size);

    return [search_option, skip, limit];
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send();
    else return res.status(500).send();
  }
}
