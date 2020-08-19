const Service  = require("typedi").Service;
const MergeContainer = require("typedi").Container;
const {User} = require("../../models/User");
const {ErrorContainer} = require('../../containers/errors/message.error');

const CustomError = ErrorContainer.get('custom.error');

let UserIDList = Service((list)=>({
  extractUserID(list){
    try{
      let ID_list =[];
      list.forEach(ele=>{ ID_list.push(ele.user_id) });

      return {err:null, ID_list};
    }catch(err){
      console.log(err);
      return {err:err};
    }
  }
}));

let UserinfoList = Service((list)=>({

  async matchUserInfo(list){
    try{
      let user_list =[];
      //@desc forEach에서 async를 사용하면 비동기처리되서 루프 종료를 기다려주지 않음
      for(const id of list){
        const userinfo = await User.findOne({_id:id},'email name native_language target_language profile_image profile_text');
        user_list.push(userinfo);
      }

      return { err:null, user_list};
    }catch(err){
      console.log(err);
      return {err: err};
    }
  }
}));

let MergedList = Service((list, user_list)=>({
  mergeListAndUser(list, user_list){
    let obj_arr = [];
    let info = {};
    let user = {};
    try {
      if(list.length !== user_list.length)
        throw new CustomError(500,"두 리스트의 크기가 같지 않습니다.")

      for(let i=0; i< list.length; i++){
        info = JSON.parse(JSON.stringify(list[i]));
        user = JSON.parse(JSON.stringify(user_list[i]));

        const obj = Object.assign({},info, user);
        obj_arr.push(obj);
      }

      return {err:null, obj_arr};
    } catch (err) {
      console.log(err);
      return {err:err};
    }
  }
}))

const MergeListUserService = Service([
  UserIDList,
  UserinfoList,
  MergedList
], (userID, userinfo, merged)=>{
  const getMergedList = async function(list){
    try{
      const userID_list = await userID.extractUserID(list);
      if(userID_list.err) throw new CustomError(500,"user id 추출 에러");

      const userinfo_list = await userinfo.matchUserInfo(userID_list.ID_list);
      if(userinfo.err) throw new CustomError(500,"해당 유저 아이디와 매치되는 유저 정보리스트 불러오기 에러")

      const merged_list = await merged.mergeListAndUser(list, userinfo_list.user_list);
      if(merged_list.err) throw MergeListAndUser("리스트를 병합하는데 에러");
      return { err:null, merged_list: merged_list.obj_arr};
    }catch(err){
      console.log(err);
      return { err:err};
    }
  }

  return getMergedList;
})

const mergeListUserService = MergeContainer.get(MergeListUserService);


module.exports = {
  mergeListUserService
}
