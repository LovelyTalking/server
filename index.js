const app = require('./configs/app');
const mongoose = require('./configs/mongo.db');
const user = require('./routes/users');
const post = require('./routes/posts');
const message = require('./routes/messages')
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc')
const swagger_option=  require('./configs/swagger');
const dotenv = require('dotenv');
const socketIO = require('./configs/socket');
const cors = require('cors');
dotenv.config();
const swaggerSpec = swaggerJSDoc(swagger_option);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/users',user);
app.use('/posts',post);
app.use('/messages',message);
app.get('/', (req,res)=>{
  res.send('hello');
})

const PORT = process.env.PORT || 3000;
const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
socketIO(server, app);

module.exports = app;
