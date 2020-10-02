const mongoose = require('../configs/mongo.db')
const {UserStateModelContainer} = require('../containers/models/userState.model.service')

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


userStateSchema.statics.turnOnUnreadCntMode = UserStateModelContainer.get('turn.on.unread.cnt.mode');
userStateSchema.statics.turnOffUnreadCntMode = UserStateModelContainer.get('turn.off.unread.cnt.mode');

const UserStateInRoom = mongoose.model('UserState', userStateSchema);

module.exports = {UserStateInRoom};
