const router = require('express').Router();
const userServices = require('../../services/users/user.service')
const {User} = require('../../models/User')
const IUserDTO = require('../../interfaces/IUser');
const { AuthContainer } = require('../../containers/auth/auth')

// TODO: make container/auth/checkUser.js
router.post('/register', userServices.registerUser );

router.get('/register/:email',userServices.checkDuplicateEmailName);

router.get('/confirmEmail', userServices.checkVerifyAuthEmail);

router.post('/login', userServices.loginUser);

const authToken = AuthContainer.get("auth.User");
router.get('/auth', authToken, userServices.sendIsAuth);

module.exports = router;
