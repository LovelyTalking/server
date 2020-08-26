const moment = require('moment');

class IMessageDTO {
  constructor(message){
    this.__id = message._id;
    this._room_id = message.room_id;
    this._user_id = message.user_id;
    this._message = message.message;
    this._register_date = message.register_date;
    this._del_ny = message.del_ny;
    this._delete_date = message.delete_date;
  }

  getSendMessageInfo(){
    return{
      room_id: this._room_id,
      user_id: this._user_id,
      message: this._message,
      register_date: moment().format()
    }
  }
}
