const moment = require('moment');

class IRoomDTO {
  constructor(room){
    this.__id = room._id;
    this._userA_id = room.userA_id;
    this._userB_id = room.userB_id;
    this._A_out_date = room.A_out_date;
    this._B_out_date = room.B_out_date;
    this._register_date = room.register_date;
  }

  getCreateRoomInfo(){
    return {
      userA_id: this._userA_id,
      userB_id: this._userB_id,
      register_date: moment().format()
    }
  }
}
