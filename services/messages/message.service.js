const { Room, UserStateInRoom } = require('../../models/Room');
const { Message }  = require('../../models/Message');
const { IRoomDTO, IUserStateInRoomDTO} = require('../../interfaces/IRoom');
const { IMessageDTO} = require('../../interfaces/IMessage')
const mongoose = require('mongoose');
const {ErrorContainer} = require('../../containers/errors/message.error');

const CustomError = ErrorContainer.get('custom.error');

const checkReqInfo = (checkInfo,res)=>{
  try{
    for(const prop in checkInfo)
      if(checkInfo[prop] === undefined ) throw new CustomError(400,"요청 데이터에 빈 객체가 존재합니다.")

    const search_option = checkInfo;
    const skip = search_option.page_size * search_option.page_index;
    const limit = search_option.page_size;

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
    let skip =0;
    let limit = 0;
    let check_info = { user_id, page_index: req.params.page_index, page_size: req.params.page_size };
    [user_id, skip, limit] = checkReqInfo(check_info, res);

    user_id = mongoose.Types.ObjectId(user._id);

    const user_states = await UserStateInRoom.find({user_info: user_id, is_out:false},'room_info');
    if(!user_states)
      return res.status(200).json({ display_room_list_success: true, room_list: []});

    const room_ids = user_states.map(state=>{ return state.room_info;});

    const room_list = await Room
      .find({users: user_id, _id: {$in:room_ids} },{sort: '-update_date', skip: skip, limit: limit})
      .populate({path: 'users', populate: {path: 'users' },select:'_id name email profile_image'})
      .populate({path: 'user_state', populate:{path:'user_state'}});

    return res.status(200).json({ display_room_list_success: true, room_list});
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send('');
    else return res.status(500).send('');
  }
}

const createMessageRoom = async(req, res)=>{
  try{
    const my_user_id = mongoose.Types.ObjectId(req.user._id);
    const other_user_id = mongoose.Types.ObjectId(req.params.user_id);

    const found_room = await Room.findOne({users :[my_user_id, other_user_id]});

    if(found_room){
      // find my_user_state, if(is_out === false) is_out = true;
      let my_state = UserStateInRoom.findById(found_room.user_state[my_user_id]);
      if(!my_state) throw new CustomError(400, "해당 룸에 유저의 상태를 찾을 수 없습니다.")

      if(my_state.is_out){
        my_state.is_out = false;
        await my_state.save();
      }

      return res.status(200).json({create_room_success: true, created_room: found_room});
    }
    else{
      // create room, create user_a state, user_b state

      const users_in_room = { users: [my_user_id, other_user_id] };
      const room_info = new IRoomDTO(users_in_room).getCreateRoomInfo();

      let room = new Room(room_info);
      let created_room = await room.save();

      let state_info = {
        room_info: created_room._id,
        user_info: my_user_id
      };
      state_info = new IUserStateInRoomDTO(state_info).getCreateUserStateInfo();
      let state = new UserStateInRoom(state_info);
      const my_state = await state.save();

      state_info.user_info = other_user_id;
      state_info = new IUserStateInRoomDTO(state_info).getCreateUserStateInfo();
      state = new UserStateInRoom(state_info);
      const other_state = await state.save();

      room.user_state.set(String(my_user_id), my_state._id);
      room.user_state.set(String(other_user_id), other_state._id);

      await room.save();

      return res.status(200).json({create_room_success: true, created_room})
    }
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send('');
    else return res.status(500).send('');
  }
}

const enterMessageRoom = async(req, res)=>{
  // input: room_id, user_id(req.user), other_user_id
  // compare room's users - user_id*2
  // message_list in room select
  try{

  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send('');
    else return res.status(500).send('');
  }
}
const sendMessageInRoom = async(req,res)=>{
  // input: room_id, user_id(req.user), message_text
  // model_func -> find room => find other user => get user/other_user state => if(!user_stat.isOnline) unread_cnt, if(!is_out)..
  // io.to(room_id).emit('message', message)
}
const leaveMessageRoom = async(req, res)=>{
}

const deleteMessageRoom = async(req, res)=>{
  // input: room_id, user_id(req.user._id)
  // find room about user_id,room_id
  // if(room) find user_state about room_id, user_id
  // if(is_out === false) is_out =true, out_date = now();
  try{

  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return res.status(err.status).send('');
    else return res.status(500).send('');
  }
}

module.exports = {
  displayRoomList, createMessageRoom, enterMessageRoom, sendMessageInRoom,
  leaveMessageRoom, deleteMessageRoom
}
