const moment = require('moment');

class IMessageDTO {
  constructor(message){
    this.__id = message._id;
    this._room_info = message.room_info;
    this._send_by = message.send_by;
    this._message = message.message;
    this._register_date = message.register_date;
    this._del_ny = message.del_ny;
    this._delete_date = message.delete_date;
  }

  getSendMessageInfo(){
    return{
      room_info: this._room_info,
      send_by: this._send_by,
      message: this._message,
      register_date: moment().format()
    }
  }
}

module.exports = {IMessageDTO}
