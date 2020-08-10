const app = require('./configs/app');
const mongoose = require('./configs/mongo.db');
const user = require('./routes/users');
const post = require('./routes/posts');
const dotenv = require('dotenv');
dotenv.config();


app.use('/users',user);
app.use('/posts',post);
app.get('/', (req,res)=>{
  res.send('hello');
})

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)

module.exports = app;
