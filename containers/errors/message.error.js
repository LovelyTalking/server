const ErrorMessageContainer = require('typedi').Container;
const Service = require('typedi').Service;

let MongoDBErrorMessageBuilder = (err,res)=>{
  console.log(err);
  return res.status(500).json({query_success: false, err: "mongoDB error" });
}


ErrorMessageContainer.set('mongoDB.error', MongoDBErrorMessageBuilder);

module.exports= {ErrorMessageContainer};
