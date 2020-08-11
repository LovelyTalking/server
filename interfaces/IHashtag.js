class IHashtagDTO {
  constructor(hashtag){
    if(!hashtag){
      this._id =  "";
      this._name =  "";
    }else{
      this._id = hashtag._id ;
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
  setName(name){
    this._name = name;
  }
}


module.exports = IHashtagDTO;
