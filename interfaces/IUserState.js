const moment = require('moment');

class IUserStateInRoomDTO {
  constructor(user_state){
    this._room_info  = user_state.room_info;
    this._user_info = user_state.user_info;
    this._is_out = user_state.is_out;
    this._room_out_date = user_state.room_out_date;
    this._is_online = user_state.is_online;
  }

  getCreateUserStateInfo(){
    return {
      room_info : this._room_info,
      user_info : this._user_info
    }
  }
}

module.exports={
   IUserStateInRoomDTO
}
