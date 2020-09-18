const mongoose = require('../configs/mongo.db')
const {MessageRoomModelContainer} = require('../containers/models/message_room.model.service')

const roomSchema = mongoose.Schema({
  users:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  }],
  user_state:{  // keys : string, value: object_id
    type: Map,
    of: {type: mongoose.Schema.ObjectId, ref:'UserState'}
  },
  register_date:{
    type: String
  },
  update_date:{
    type: String
  }
})
const Room = mongoose.model('Room', roomSchema);

const userStateSchema = mongoose.Schema({
  room_info:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  user_info:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  is_out:{
    type: Boolean,
    default: false
  },
  room_out_date:{
    type: String
  },
  unread_cnt:{
    type: Number,
    default: 0
  },
  is_online:{
    type: Boolean,
    default: false
  }
})

const UserStateInRoom = mongoose.model('UserState', userStateSchema)

userStateSchema.statics.turnOnUnreadCntMode = MessageRoomModelContainer.get('turn.on.unread.cnt.mode');
userStateSchema.statics.turnOffUnreadCntMode = MessageRoomModelContainer.get('turn.off.unread.cnt.mode');

module.exports = {Room, UserStateInRoom};
