const moment = require('moment');

class IRoomDTO {
  constructor(room){
    this.__id = room._id;
    this._userA = room.userA;
    this._userB = room.userB;
    this._A_out_date = room.A_out_date;
    this._B_out_date = room.B_out_date;
    this._register_date = room.register_date;
  }

  getCreateRoomInfo(){
    return {
      userA: this._userA,
      userB: this._userB,
      register_date: moment().format()
    }
  }
}
