const router = require('express').Router();
const postList = require('./display.postList');
const comment = require('./comment');
const correction = require('./correction');
const postServices = require('../../services/posts/post.service')
const { AuthContainer } = require('../../middlewares/auth/auth')
const { validatePost} = require('../../middlewares/validator/validator')

const authToken = AuthContainer.get("auth.User");

router.use(authToken);

router.post('/upload', validatePost, postServices.uploadPost);
router.get('/display/:_id',  validatePost, postServices.displayOnePost);
router.post('/update',  validatePost, postServices.updatePost);
router.get('/delete/:_id',  validatePost, postServices.deletePost);

router.use('/display/list', postList);
router.use('/comment',comment);
router.use('/correction',correction);

module.exports = router;
