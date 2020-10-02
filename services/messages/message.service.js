const { Room } = require('../../models/Room');
const { UserStateInRoom } = require('../../models/UserState');
const { Message }  = require('../../models/Message');
const { IRoomDTO } = require('../../interfaces/IRoom');
const { IUserStateInRoomDTO} = require('../../interfaces/IUserState');
const { IMessageDTO} = require('../../interfaces/IMessage')
const mongoose_type = require('mongoose').Types;
const {ErrorContainer} = require('../../containers/errors/message.error');

const CustomError = ErrorContainer.get('custom.error');

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

const displayRoomList = async(req, res)=>{
  // @desc: req.param.room_id 에 해당하는 룸리스트들 조회( user_state의 is_out이 false이고, 업데이트 아이디가 최신인 순
  try{
    let user_id = req.user._id;

    let check_info = { user_id, page_index: req.params.page_index, page_size: req.params.page_size };
    const [search_option, skip, limit] = checkReqInfo(check_info, res);

    user_id = mongoose_type.ObjectId(search_option.user_id);


    const {err, room_list} = await Room.findRoomListIncludedMyUserInfo(search_option, skip, limit);
    if(err) throw new CustomError(400, "룸 리스트 조회 모델함수에서 에러");

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

    if(err) throw new CustomError(400,"메신저 룸을 생성하는 모델함수에서 에러");

    return res.status(200).json({create_room_success:true, created_room});
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send('');
    else return res.status(500).send('');
  }
}

const enterMessageRoom = async (req, res)=>{
  // input: room_id, user_id(req.user), other_user_id
  // compare room's users - user_id*2
  // message_list in room select
  try{
    const room_id = mongoose_type.ObjectId(req.params.room_info);
    const other_user = mongoose_type.ObjectId(req.params.user_id);
    const my_user= mongoose_type.ObjectId(req.user._id);
    console.log(room_id, other_user, my_user);
    const room = await Room.findOne({_id: room_id, users:{$all: [other_user, my_user]}});
    if(!room) throw new CustomError(400,"요청에 해당하는 Room이 없습니다")

    let my_state = await UserStateInRoom.findOne({room_info:room_id, user_info: my_user});
    if(!my_state) throw new CustomError(400,"요청한 유저의 룸에 대한 상태 정보가 없습니다.");

    if(my_state.is_out)
      my_state.is_out = false;

    //한번에 보내는 메시지 리스트개수(5개) -> 임의
    const message_list = await Message.find({room_info:room_id},"_id send_by message register_date",{sort: '-register_date',limit:5});

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
      {room_info:room_info},
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
  // input: room_id, user_id(req.user), message_text
  // model_func -> find room => find other user => get user/other_user state => if(!user_stat.isOnline) unread_cnt, if(!is_out)..
  // io.to(room_id).emit('message', message)
  try{
    req.body["send_by"]= req.user._id;
    const message_info = new IMessageDTO(req.body).getSendMessageInfo();

    const room = await Room.findById({_id: message_info.room_info});
    if(!room) throw new CustomError(400, "요청한 룸 아이디에 대한 룸 정보가 없습니다.")
    let other_user;
    [other_user] = room.users.filter(id=> id !== message_info.send_by);

    const other_user_state = await UserStateInRoom.findOneAndUpdate(
      {room_info: room._id, user_info:other_user},
      {$set: {is_out: false}},
      {new: true, runValidators: true}
    );
    if(!other_user_state.isOnline){
      ++other_user_state.unread_cnt;
      await other_user_state.save();
    }

    room.update_date = message_info.register_date;
    await room.save();

    const message = new Message(message_info);
    if(!message) throw new CustomError(400,"해당 요청 메시지의 데이터 구성이 올바르지 않습니다.")

    req.app.get('io').of('/message').to(req.params.room_info).emit('message', message);
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
  // input: room_id, user_id(req.user._id)
  // find room about user_id,room_id
  // if(room) find user_state about room_id, user_id
  // if(is_out === false) is_out =true, out_date = now();
  try{
      const room_id = mongoose_type.ObjectId(req.params.room_info);
      const user_id = mongoose_type.ObjectId(req.user._id);

      const room = await Room.findOne({_id:room_id, users:{$in:user_id}});
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
