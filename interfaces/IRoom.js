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


module.exports = {
  IRoomDTO
}
