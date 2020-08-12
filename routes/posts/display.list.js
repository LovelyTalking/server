const router = require('express').Router();
const postDiplayListServices = require('../../services/posts/display.list.service');
/*
  @desc TODO: 포스트 리스트를 보여줘야하는 경우는 총 3가지다
  1) 유저 별 포스트리스트
  2) native 와 target language 별 포스트 리스트
  3) 해시태그 별 포스트 리스트
*/


module.exports = router;
