const UserStateModelContainer = require('typedi').Container;
const { Room } = require('../../models/Room');
const { IRoomDTO } = require('../../interfaces/IRoom');
const { IUserStateInRoomDTO} = require('../../interfaces/IUserState');
const {Message} = require('../../models/Message');
const {IMessageDTO} = require('../../interfaces/IMessage')
const {ErrorContainer} = require('../errors/message.error');
const mongoose_type = require('mongoose').Types;

const CustomError= ErrorContainer.get('custom.error');

const turnOffUnreadCntMode = async function(room_id, user_id){
  try{
    let user_state = await this.findOne({room_info: room_id, user_info: user_id});
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
    let user_state = await this.findOne({room_info: room_id, user_info: user_id});
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

UserStateModelContainer.set('turn.off.unread.cnt.mode',turnOffUnreadCntMode);
UserStateModelContainer.set('turn.on.unread.cnt.mode',turnOnUnreadCntMode);

module.exports = { UserStateModelContainer }
