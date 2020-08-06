const app = require('../../index.js');
const request = require('supertest');
const should = require('should');

/*
@desc
회원가입, 로그인, 인증처리 과정은 테스트케이스만 만들고 postman으로만 확인완료 했고 테스트코드는 돌리지 않았습니다 프로필 수정 및 제거부터 테스트 코드로 테스트케이스 들을 확인합니다.

*/
describe(' POST /users/upload/image ->', () =>{
  let req_body = {
    _id: "5f2a7734b5d2962355ce5ff4",
    profile_image: "./server/id/imgName"
  }
  describe('case success : ',()=>{
    const expect_ans = 'success'
    let body
    before(done=>{
      request(app)
        .post('/routes/users/)
        .send(req_body)
        .expect(200)
        .end((err,res)=>{
          body = res.body;
          done();
        });
    });
    it('이미지 업로드가 성공적으로 했다는 사실을 객체로 전달', ()=>{
      body.should.have.property('upload_image_success', expect_ans);
    });
  })
})
