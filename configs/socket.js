const SocketIO = require('socket.io');

module.exports = (server, app)=>{
  const io = SocketIO(server,{
    path:'/socket.io',
    wsEngine: 'eiows'
  });

  app.set('io',io);
  const room = io.of('room');
  const message = io.of('message');

  io.use((socket, next)=>{
    authToken(socket.request, socket.request.res, next);
  })

  room.on('connection', (socket)=>{
    console.log('room namespace entered')
    socket.on('disconnect',()=>{
      console.log('room namespace leaved');
    })
  })

  message.on('connection', (socket)=>{
    console.log('message namespace entered');
    const req = socket.request;
    const { header: {referer} } = req;
    const room_id = referer
      .split('/')[referer.split('/').lenth-1]
      .replace(/\?.+/, '');

    //TODO : 안 읽은 메시지 개수 초기화 => unread_cnt mode off
    socket.join(room_id);

    socket.on('disconnect',()=>{
      console.log('message namespace leaved')
      socket.leave(room_id);
      //TODO: user_state's isOnline: false => unread_cnt mode on
    })
  })
}
