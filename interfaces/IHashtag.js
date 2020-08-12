class IHashtagDTO {
  constructor(hashtag){
    if(!hashtag){
      this.__id =  "";
      this._name =  "";
    }else{
      this.__id = hashtag._id ;
      this._name = hashtag.name ;
    }
  }

  set name(name){
    this._name = name;
  }

  get name(){
    return {
      name: this._name
    }
  }
}


module.exports = IHashtagDTO;
