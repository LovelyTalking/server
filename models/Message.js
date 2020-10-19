const mongoose = require('../configs/mongo.db')
const {RoomModelContainer} = require('../containers/models/message.model.service')

const messageSchema = mongoose.Schema({
  room_info:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  send_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message:{
    type: String,
    minLength: 1,
    maxLength: 4000,
    required: true,
  },
  register_date:{
    type: String
  },
  del_ny :{
    type: Boolean,
    default: false
  },
  delete_date:{
    type: String
  }
})

const Message = mongoose.model('Message', messageSchema);

module.exports = {Message};
