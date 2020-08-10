const router = require('express').Router();
const userServices = require('../../services/users/user.service')
const { AuthContainer } = require('../../containers/auth/auth')

// TODO: make container/auth/checkUser.js


router.post('/register', userServices.registerUser );
router.get('/register/:email',userServices.checkDuplicateEmailName);
router.get('/confirmEmail', userServices.checkVerifyAuthEmail);

router.post('/login', userServices.loginUser);
router.get('/logout', userServices.logoutUser);

router.post('/upload/profileImage',userServices.uploadProfileImage);
router.post('/upload/profileText', userServices.uploadProfileText);

router.post('/update/user', userServices.updateUserInfo);

router.post('/confirm/password', userServices.confirmUserPassword);
router.post('/update/password',userServices.updateUserPassword);

// TODO: delete user -> update delny data in user info
router.post('/delete', userServices.deleteUser);



const authToken = AuthContainer.get("auth.User");
router.get('/auth', authToken, userServices.sendIsAuth);

module.exports = router;
