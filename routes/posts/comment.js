const router = require('express').Router();
const commentServices = require('../../services/posts/comment.service');
const { AuthContainer } = require('../../containers/auth/auth');

const authToken = AuthContainer.get("auth.User");

router.post('/upload',authToken, commentServices.uploadComment);
router.get('/delete/:_id/:post_id',authToken, commentServices.deleteComment);
router.get('/display/:post_id/:page_index/:page_size',authToken, commentServices.displayCommentList);

module.exports = router;
