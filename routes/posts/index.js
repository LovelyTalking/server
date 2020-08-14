const router = require('express').Router();
const postServices = require('../../services/posts/post.service')
const post_list = require('./display.list');
const { AuthContainer } = require('../../containers/auth/auth')

const authToken = AuthContainer.get("auth.User");

router.get('/', (req,res)=>{
  res.send('hello');
})

router.post('/upload', authToken, postServices.uploadPost);
router.get('/display/:_id', authToken, postServices.displayOnePost);
router.post('/update', authToken, postServices.updatePost);
router.get('/delete/:_id', authToken, postServices.deletePost);

router.use('/display/list',post_list);

module.exports = router;
