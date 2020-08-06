const router = require('express').Router();
const userServices = require('../../services/users/user.service')
const { AuthContainer } = require('../../containers/auth/auth')
const UserService = require('../../services/users/user.service')
// TODO: make container/auth/checkUser.js


router.post('/register', userServices.registerUser );
router.get('/register/:email',userServices.checkDuplicateEmailName);
router.get('/confirmEmail', userServices.checkVerifyAuthEmail);

router.post('/login', userServices.loginUser);
// TODO: need logout api
router.post('/upload/profileImage',userServices.uploadProfileImage);
router.post('/upload/profileText', userServices.uploadProfileText);
// TODO: update user Info
router.post('/update/user', userServices.updateUserInfo);
// TODO: update password
const authToken = AuthContainer.get("auth.User");
router.get('/auth', authToken, userServices.sendIsAuth);

module.exports = router;
