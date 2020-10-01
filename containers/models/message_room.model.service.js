const MessageRoomModelContainer = require('typedi').Container;
const {Room, UserStateInRoom} = require('../../models/Room');
const {IRoomDTO, IUserStateInRoomDTO} = require('../../interfaces/IRoom');
const {Message} = require('../../models/Message');
const {IMessageDTO} = require('../../interfaces/IMessage')
const {ErrorContainer} = require('../errors/message.error');
const mongoose_type = require('mongoose').Types;

const CustomError= ErrorContainer.get('custom.error');

const findRoomListIncludedMyUserInfo = async function(search_option, skip, limit){
  try{
    let room_list = [];
    const user_id = mongoose_type.ObjectId(search_option.user_id);
    console.log(typeof Room);
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

const turnOffUnreadCntMode = async function(room_id, user_id){
  try{
    let user_state = await UserStateInRoom.findOne({room_info: room_id, user_info: user_id});
    if(!user_state) throw new CustomError(400,"요청한 데이터에 해당하는 유저 상태정보가 없습니다.");

    user_state.unread_cnt = 0;
    user_state.is_online = true;

    await user_state.save();

    let err;
    return err = null;
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return err;
    else return err;
  }
}

const turnOnUnreadCntMode = async function(room_id, user_id){
  try{
    let user_state = await UserStateInRoom.findOne({room_info: room_id, user_info: user_id});
    if(!user_state) throw new CustomError(400,"요청한 데이터에 해당하는 유저 상태정보가 없습니다.");

    user_state.unread_cnt = 0;
    user_state.is_online = false;

    await user_state.save();

    let err;
    return err = null;
  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return err;
    else return err;
  }
}

MessageRoomModelContainer.set('turn.off.unread.cnt.mode',turnOffUnreadCntMode);
MessageRoomModelContainer.set('turn.on.unread.cnt.mode',turnOnUnreadCntMode);
MessageRoomModelContainer.set('find.roomlist.included.my.userinfo',findRoomListIncludedMyUserInfo);
module.exports = { MessageRoomModelContainer }
