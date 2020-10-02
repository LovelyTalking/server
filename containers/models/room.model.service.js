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
    console.log(my_user_id, other_user_id);

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

RoomModelContainer.set('find.roomlist.included.my.userinfo',findRoomListIncludedMyUserInfo);
RoomModelContainer.set('create.room.user.state',createRoomAndUserState);

module.exports= {RoomModelContainer}
