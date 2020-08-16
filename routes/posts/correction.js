const router = require('express').Router();
const correctionServices = require('../../services/posts/correction.service');
const { AuthContainer } = require('../../containers/auth/auth');

const authToken = AuthContainer.get("auth.User");

router.post('/upload',authToken, correctionServices.uploadCorrection);
router.get('/delete/:_id/:post_id',authToken, correctionServices.deleteCorrection);

module.exports = router;
