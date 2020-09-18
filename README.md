# PLaCon server
🎪*Play Language Concert*

Server for the PLaCon

### 📖 Subject
외국어 공부 학습과 글 안에 담긴 스토리 전달을 함께 할 수 잇는 SNS입니다.
자신이 배우고 싶은 외국어로 직접 포스트를 작성하고 다양한 사람들의 첨삭과 댓글을 참고할 수 있습니다.
1:1 대화를 나누고 싶다면 메신저 기능을 사용할 수 있습니다.

### 💻 Stack
- Node.js
- Express.js
- Socket.js
- MongoDB
- Javascript

### 🎁 Services
1. User Management API
1. Post API
1. Comment/Correction API
1. Message API

### 🚨 Notice
- 현재 진행중이라는 점!
- 윈도우에서는 socket.io의 eiows가 적용되지 않습니다.
- dotenv를 통해 .env파일을 불러옵니다. 하지만 github에 .env파일을 올리지 않습니다
  - .env에는 mongoDB url, google email auth id/secret... 코드에 노출되지 않아야할 요소들을 담았습니다.
