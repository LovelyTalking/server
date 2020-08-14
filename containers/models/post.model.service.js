const PostModelContainer = require('typedi').Container;
const {Hashtag} = require('../../models/Hashtag');
const IHashtagDTO = require('../../interfaces/IHashtag');
const {ErrorMessageContainer} = require('../errors/message.error');

const checkHashtagAndUpdate = function(next){
  let post = this;
  let hashtags = post.hashtags;
  hashtags.forEach((hashtag_name) => {
    Hashtag.findOne({name:hashtag_name}, (err, found_hashtag)=>{
      if(err) next(err);

      if(!found_hashtag){
        const hashtagDTO = new IHashtagDTO();
        hashtagDTO.name= hashtag_name;

        const insert_hashtag = hashtagDTO.name;

        const hashtag_doc = new Hashtag(insert_hashtag);
        hashtag_doc.save((err,saved_hashtag)=>{
          if(err) next(err);
        })
      }
    })
  });
  next();
}

const findHashtagAndSave = function(hashtags,res){
  hashtags.forEach( async(hashtag_name) => {
    try{
      const found_hashtag = await Hashtag.findOne({name:hashtag_name});
      if(!found_hashtag){
        const hashtagDTO = new IHashtagDTO();
        hashtagDTO.name= hashtag_name;
        const insert_hashtag = hashtagDTO.name;

        const hashtag_doc = new Hashtag(insert_hashtag);
        await hashtag_doc.save();
      }
    }catch(err){
      sendMongooseErr(err,res);
    }
  })
}


const sendMongooseErr= ErrorMessageContainer.get('mongoDB.error');

PostModelContainer.set('check.hashtag.update', checkHashtagAndUpdate);
PostModelContainer.set('find.hashtag.save', findHashtagAndSave );
module.exports = { PostModelContainer }
