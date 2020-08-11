const mongoose = require('../configs/mongo.db')

const hashtagSchema = mongoose.Schema({
  name:{
    type:String,
    minLength: 2,
    maxLength: 30
  }
})

const Hashtag = mongoose.model('Hashtag',hashtagSchema);
module.exports = {Hashtag};
