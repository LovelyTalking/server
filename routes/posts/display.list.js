const router = require('express').Router();
const postDisplayListServices = require('../../services/posts/display.list.service');
const { AuthContainer } = require('../../containers/auth/auth')

const authToken = AuthContainer.get("auth.User");
/*
  @desc TODO: 포스트 리스트를 보여줘야하는 경우는 총 3가지
  1) 유저 별 포스트리스트
  2) native 와 target language 별 포스트 리스트
  3) 해시태그 별 포스트 리스트
*/
router.get('/user/:user_id/:page_index/:page_size', authToken, postDisplayListServices.displayUserRelatedPostList);

router.get(
  '/lang/:native_language/:target_language/:page_index/:page_size',
  authToken,
  postDisplayListServices.displayLangRelatedPostList
);

router.get(
  '/hashtag/:hashtag_name/:page_index/:page_size',
  authToken,
  postDisplayListServices.displayHashtagRelatedPostList
);

module.exports = router;
