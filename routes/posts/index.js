const router = require('express').Router();
const postServices = require('../../services/posts/post.service')
const post_list = require('./display.list');
router.get('/', (req,res)=>{
  res.send('hello');
})

router.post('/upload', postServices.uploadPost);
router.get('/display/:_id', postServices.displayOnePost);
router.post('/update', postServices.updatePost);

router.use('/display/list',post_list);

module.exports = router;
