const router = require('express').Router();
const commentServices = require('../../services/posts/comment.service');
const { validateComment } = require('../../middlewares/validator/validator')

router.post('/upload', validateComment, commentServices.uploadComment);

router.get('/delete/:_id/:post_id', validateComment, commentServices.deleteComment);

router.get('/display/:post_id/:page_index/:page_size', validateComment, commentServices.displayCommentList);

module.exports = router;
