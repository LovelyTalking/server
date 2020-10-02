const mongoose = require('../configs/mongo.db')
const {RoomModelContainer} = require('../containers/models/room.model.service')

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

roomSchema.statics.findRoomListIncludedMyUserInfo = RoomModelContainer.get('find.roomlist.included.my.userinfo');
roomSchema.statics.createRoomAndUserState = RoomModelContainer.get('create.room.user.state');

const Room = mongoose.model('Room', roomSchema);


module.exports = {Room};
