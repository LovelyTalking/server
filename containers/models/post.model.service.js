const PostModelContainer = require('typedi').Container;
const {Hashtag} = require('../../models/Hashtag');
const IHashtagDTO = require('../../interfaces/IHashtag');
//const {ErrorMessageContainer} = require('../errors/message.error');

const checkHashtagAndUpdate = function(next){
  let post = this;

  let hashtags = post.hashtags;
  for(const hashtag_name of hashtags){
    // @desc hashtag가 없으면 db에 추가하고 post.save()로 next()
    Hashtag.findOne({name:hashtag_name}, (err, found_hashtag)=>{
      if(err) next(err);

      if(!found_hashtag){
        const hashtagDTO = new IHashtagDTO();
        hashtagDTO.name= hashtag_name;
        const insertHashtag = hashtagDTO.name;

        const hashtag_doc = new Hashtag(insertHashtag);
        hashtag_doc.save((err,saved_hashtag)=>{
          if(err) next(err);
        })
      }
    })
  }
  next();
}



//const sendMongooseErr= ErrorMessageContainer.get('mongoDB.error');
PostModelContainer.set('check.hashtag.update', checkHashtagAndUpdate);

module.exports = { PostModelContainer }
