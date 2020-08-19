const ErrorContainer = require('typedi').Container;
const moment = require('moment');

class CustomError extends Error{
  constructor(status =400, ...params){
    super(...params);

    if(Error.captureStackTrace){
      Error.captureStackTrace(this, CustomError);
    }
    this.status = status;
    this.date = moment().format();
  }
}

ErrorContainer.set('custom.error',CustomError);

module.exports = {ErrorContainer}
