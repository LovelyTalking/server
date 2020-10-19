const SocketIO = require('socket.io');
const {UserStateInRoom} = require('../models/UserState');

module.exports = (server, app)=>{
  try{
    const io = SocketIO(server,{
      path:'/socket.io',
      wsEngine: 'eiows'
    });

    app.set('io',io);
    const room = io.of('room');
    const message = io.of('message');

    room.on('connection', (socket)=>{
      console.log('room namespace entered')
      socket.on('disconnect',()=>{
        console.log('room namespace leaved');
      })
    })

    message.on('connection', async (socket)=>{
      console.log('message namespace entered');

      const {room_id, user_id, ...etc}= socket.handshake.query;

      const turn_off_err = await UserStateInRoom.turnOffUnreadCntMode(room_id, user_id);

      // message 네임스페이스에 연결할 때 룸, 유저 정보를 받아오는가
      if(turn_off_err) {
        socket.emit('message_error',"유저상태의 읽지않은 메시지 수 초기화 및 온라인 전환 업데이트 오류");
        console.log("err: ",turn_off_err);
      }else{
        socket.join(room_id);
      }


      socket.on('disconnect',async ()=>{
        console.log('message namespace leaved')
        const turn_on_err = await UserStateInRoom.turnOnUnreadCntMode(room_id, user_id);
        if(turn_on_err) {
          socket.emit('message_error',"유저상태의 읽지않은 메시지 수 초기화 및 오프라인 전환 업데이트 오류");
          console.log(turn_on_err);
        }else{
          socket.leave(room_id);
        }
      })
    })
  }catch(err){
    console.log(err);
    return;
  }
}
