const moment = require('moment');

class IRoomDTO {
  constructor(room){
    this.__id = room._id;
    this._users = room.users;
    this._user_state = room.user_state;
    this._register_date = room.register_date;
    this._update_date = room.update_date;
  }

  getCreateRoomInfo(){
    return {
      users : this._users,
      user_state: {},
      register_date: moment().format(),
      update_date: moment().format(),
    }
  }
}

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

module.exports = {
  IRoomDTO, IUserStateInRoomDTO
}
