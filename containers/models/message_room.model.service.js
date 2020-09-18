const MessageRoomModelContainer = require('typedi').Container;
const {Room, UserStateInRoom} = require('../../models/Room');
const {IRoomDTO, IUserStateInRoomDTO} = require('../../interfaces/IRoom');
const {Message} = require('../../models/Message');
const {IMessageDTO} = require('../../interfaces/IMessage')
const {ErrorContainer} = require('../errors/message.error');
const mongoose_type = require('mongoose').Types;

const CustomError= ErrorContainer.get('custom.error');

const findHashtagAndSave = async function(hashtags){
  try{
    for(const hashtag_name of hashtags){
      const found_hashtag = await Hashtag.findOne({name:hashtag_name});
      if(!found_hashtag){
        const hashtagDTO = new IHashtagDTO();
        hashtagDTO.name= hashtag_name;
        const insert_hashtag = hashtagDTO.name;

        const hashtag_doc = new Hashtag(insert_hashtag);
        await hashtag_doc.save();
      }
    }
    return {err:null};

  }catch(err){
    console.log(err);
    if( err instanceof CustomError) return {err: err, status:400};
    else return {err:err, status:500}
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
module.exports = { MessageRoomModelContainer }
