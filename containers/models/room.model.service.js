const RoomModelContainer = require('typedi').Container;
const { UserStateInRoom } = require('../../models/UserState');
const { IRoomDTO } = require('../../interfaces/IRoom');
const { IUserStateInRoomDTO} = require('../../interfaces/IUserState');
const {Message} = require('../../models/Message');
const {IMessageDTO} = require('../../interfaces/IMessage')
const {ErrorContainer} = require('../errors/message.error');
const mongoose_type = require('mongoose').Types;


const CustomError= ErrorContainer.get('custom.error');

const findRoomListIncludedMyUserInfo = async function(search_option, skip, limit){
  try{
    let room_list = [];
    const user_id = mongoose_type.ObjectId(search_option.user_id);

    const user_states = await UserStateInRoom.find({user_info: user_id, is_out:false},'room_info');
    if(!user_states)
      return {err:null, room_list};

    const room_ids = user_states.map(state=>{ return state.room_info; });

    room_list = await this
      .find({ _id: {$in:room_ids},users: user_id },'_id users user_state register_date update_date',{sort: '-update_date', skip: skip, limit: limit})
      .populate({path: 'users', populate: {path: 'users' },select:'_id name email profile_image'})
      .populate({path: 'user_state', populate:{path:'user_state'}});

    return {err:null, room_list};

  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return err;
    else return err;
  }
}

const createRoomAndUserState = async function(user){
  try{
    const [my_user_id, other_user_id] = user;

    const found_room = await this.findOne({users: {$all:[my_user_id, other_user_id]}});

    if(found_room){
      // find my_user_state, if(is_out === false) is_out = true;
      let my_state = UserStateInRoom.findById(found_room.user_state[my_user_id]);
      if(!my_state) throw new CustomError(400, "해당 룸에 유저의 상태를 찾을 수 없습니다.")

      if(my_state.is_out){
        my_state.is_out = false;
        await my_state.save();
      }

      return {err: null, created_room: found_room};
    }
    else{
      const users_in_room = { users: [my_user_id, other_user_id] };
      const room_info = new IRoomDTO(users_in_room).getCreateRoomInfo();

      let room = new this(room_info);
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

      return {err:null, created_room};

    }
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return err;
    else return err;
  }
}

const findRoomAndUserState = async function(search_info){
  try{
    const {room_id, other_user, my_user} = search_info;
    const room = await this.findOne({_id: room_id, users:{$all: [other_user, my_user]}});
    if(!room) throw new CustomError(400, "요청에 해당하는 룸이 없습니다.");

    let my_state = await UserStateInRoom.findOne({room_info:room_id, user_info: my_user});
    if(!my_state) throw new CustomError(400,"요청한 유저의 룸에 대한 상태 정보가 없습니다.");

    if(my_state.is_out){
      my_state.is_out = false;
      my_state = await my_state.save();
    }

    return {err:null};
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return err;
    else return err;
  }
}

const updateRoomAndUserStateBeforeSendingMessage = async function(update_info){
  try{
    const {room_info, send_by, register_date} = update_info;
    const room = await this.findById({_id: room_info});
    if(!room) throw new CustomError(400, "요청한 룸 아이디에 대한 룸 정보가 없습니다.")

    const [other_user] = room.users.filter(id=> String(id) !== String(send_by));
    const other_user_state = await UserStateInRoom.findOneAndUpdate(
      {room_info: room._id, user_info:other_user},
      {$set: {is_out: false}},
      {new: true, runValidators: true}
    );

    if(!other_user_state) throw new CustomError(400, "요청한 유저의 룸에 대한 상태 정보가 없습니다.")
    if(!other_user_state.is_online){
      ++other_user_state.unread_cnt;
      await other_user_state.save();
    }

    room.update_date = register_date;
    await room.save();
    return {err:null};
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return err;
    else return err;
  }
}



RoomModelContainer.set('find.roomlist.included.my.userinfo',findRoomListIncludedMyUserInfo);
RoomModelContainer.set('create.room.user.state',createRoomAndUserState);
RoomModelContainer.set('find.room.user.state',findRoomAndUserState);
RoomModelContainer.set('update.room.user.state.before.sending.message',updateRoomAndUserStateBeforeSendingMessage);

module.exports= {RoomModelContainer}
