const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: __dirname+"/../.env"});
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true, useUnifiedTopology : true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('mongoDB connected')).catch(
  err=>console.log(err)
);

module.exports = mongoose;
