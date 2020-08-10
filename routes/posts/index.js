const router = require('express').Router();
const postServices = require('../../services/posts/post.service')

router.get('/', (req,res)=>{
  res.send('hello');
})

router.post('/upload', postServices.uploadPost);


module.exports = router;
