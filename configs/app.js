const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan =  require('morgan');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

if(process.env.NODE_ENV !== 'test'){
  app.use(morgan('dev'));
}

module.exports = app;
