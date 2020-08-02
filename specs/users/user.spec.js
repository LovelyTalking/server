const app = require('../../index.js');
const request = require('supertest');
const should = require('should');

describe(' GET /routes/users/:email ->', () =>{
  describe('case success : ',()=>{
    it('가입 가능한 이메일이라는 사실을 담은 객체로 응답한다', (done)=>{
      request(app)
        .get('/routes/users/abc@naver.com')

    })
  })
})
