const router = require('express').Router();
const postList = require('./display.list');
const comment = require('./comment');
const correction = require('./correction');
const postServices = require('../../services/posts/post.service')
const { AuthContainer } = require('../../containers/auth/auth')

const authToken = AuthContainer.get("auth.User");

router.get('/', (req,res)=>{
  res.send('hello');
})

router.post('/upload', authToken, postServices.uploadPost);
router.get('/display/:_id', authToken, postServices.displayOnePost);
router.post('/update', authToken, postServices.updatePost);
router.get('/delete/:_id', authToken, postServices.deletePost);

router.use('/display/list',postList);
router.use('/comment',comment);
router.use('/correction',correction);

module.exports = router;
