const mongoose = require('../configs/mongo.db')

const roomSchema = mongoose.Schema({
  userA_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userB_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  A_out_date:{
    type: String
  },
  B_out_date:{
    type: String
  },
  register_date:{
    type: String
  }
})

const Room = mongoose.model('Room', roomSchema);

module.exports = {Room};
