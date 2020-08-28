const router = require('express').Router();
const userServices = require('../../services/users/user.service')
const { AuthContainer } = require('../../middlewares/auth/auth')
const { validateUser} = require('../../middlewares/validator/validator')
// TODO: make container/auth/checkUser.js
const authToken = AuthContainer.get("auth.User");



router.use(validateUser);

/**
 * @swagger
 * tags:
 *  name: User
 *  description: This is User API specification
*/

/**
 * @swagger
 * /users/register:
 *   post:
 *     sumary: sign up user
 *     tags: [User]
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: ""
 *       required: true
 *       schema:
 *         type: object
 *         $ref: '#/definitions/RegisterRequest'
 *     responses:
 *       200:
 *         description: register_success object
 *         schema:
 *           type: object
 *           $ref: '#/definitions/RegisterResponse'
*/
router.post('/register', userServices.registerUser );

/**
 * @swagger
 * /users/register/{email}:
 *   get:
 *     sumary: email duplicate check
 *     tags: [User]
 *     parameters:
 *     - in: path
 *       name: "email"
 *       description: ""
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: check_duplicated_email_success object
 *         schema:
 *           type: object
 *           $ref: '#/definitions/RegisterDuplicateResponse'
*/
router.get('/register/:email',userServices.checkDuplicateEmailName);


router.get('/confirmEmail', userServices.checkVerifyAuthEmail);

/**
 * @swagger
 * /users/login:
 *   post:
 *     sumary: login user
 *     tags: [User]
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: ""
 *       required: true
 *       schema:
 *         type: object
 *         $ref: '#/definitions/LoginRequest'
 *     responses:
 *       200:
 *         description: if login success, login_success is true
 *         schema:
 *           type: object
 *           $ref: '#/definitions/LoginResponse'
*/
router.post('/login', userServices.loginUser);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     sumary: logout user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: if logout success, logout_success is true
 *         schema:
 *           type: object
 *           $ref: '#/definitions/LogoutResponse'
*/
router.get('/logout', authToken , userServices.logoutUser);

/**
 * @swagger
 * /users/upload/profileImage:
 *   post:
 *     sumary: upload new profile_image
 *     tags: [User]
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: ""
 *       required: true
 *       schema:
 *         type: object
 *         $ref: '#/definitions/UpdateProfileImageRequest'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/UpdateProfileImageResponse'
*/
router.post('/upload/profileImage', authToken, userServices.uploadProfileImage);

/**
 * @swagger
 * /users/upload/profileText:
 *   post:
 *     sumary: upload new profile_text
 *     tags: [User]
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: ""
 *       required: true
 *       schema:
 *         type: object
 *         $ref: '#/definitions/UpdateProfileTextRequest'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/UpdateProfileTextResponse'
*/
router.post('/upload/profileText', authToken, userServices.uploadProfileText);

/**
 * @swagger
 * /users/update/user:
 *   post:
 *     sumary: update user info
 *     tags: [User]
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: ""
 *       required: true
 *       schema:
 *         type: object
 *         $ref: '#/definitions/UpdateUserInfoRequest'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/UpdateUserInfoResponse'
*/
router.post('/update/user', authToken, userServices.updateUserInfo);



/**
 * @swagger
 * /users/confirm/password:
 *   post:
 *     sumary: before update user ,password confirm password
 *     tags: [User]
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: ""
 *       required: true
 *       schema:
 *         type: object
 *         $ref: '#/definitions/ConfirmPasswordRequest'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ConfirmPasswordResponse'
*/
router.post('/confirm/password', authToken, userServices.confirmUserPassword);

/**
 * @swagger
 * /users/update/password:
 *   post:
 *     sumary: update user password
 *     tags: [User]
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: ""
 *       required: true
 *       schema:
 *         type: object
 *         $ref: '#/definitions/UpdatePasswordRequest'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/UpdatePasswordResponse'
*/
router.post('/update/password', authToken, userServices.updateUserPassword);

/**
 * @swagger
 * /users/delete:
 *   post:
 *     sumary: delete user
 *     tags: [User]
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: ""
 *       required: true
 *       schema:
 *         type: object
 *         $ref: '#/definitions/DeleteUserRequest'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/DeleteUserResponse'
*/
router.post('/delete', authToken, userServices.deleteUser);


/**
 * @swagger
 * /users/display/one/{_id}:
 *   get:
 *     sumary: display one user info
 *     tags: [User]
 *     parameters:
 *     - in: "path"
 *       name: "_id"
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: check_duplicated_email_success object
 *         schema:
 *           type: object
 *           $ref: '#/definitions/DisplayOneUserResponse'
*/
// @desc TODO: get user info of One, multi
router.get('/display/one/:email', authToken, userServices.displayOneUser);


/**
 * @swagger
 * /users/display/list/{name}/{page_index}/{page_size}:
 *   get:
 *     sumary: display one user info
 *     tags: [User]
 *     parameters:
 *     - in: "path"
 *       name: "name"
 *       required: true
 *       schema:
 *         type: string
 *     - in: "path"
 *       name: "page_index"
 *       required: true
 *       schema:
 *         type: string
 *     - in: "path"
 *       name: "page_size"
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: check_duplicated_email_success object
 *         schema:
 *           type: object
 *           $ref: '#/definitions/DisplayUserListResponse'
*/
router.get('/display/list/:name/:page_index/:page_size', authToken, userServices.displayUserList);

router.get('/auth', authToken, userServices.sendIsAuth);

module.exports = router;


/**
 * @swagger
 * definitions:
 *  RegisterRequest:
 *   type: object
 *   properties:
 *     email:
 *      type: string
 *      description: unique, mail type, required
 *     name:
 *      type: string
 *      description: max 100, required
 *     password:
 *      type: string
 *      desciprtion: min 8, max 25, required
 *     native_language:
 *      type: string
 *      description: min 2, max 2, required, uppercase
 *     target_language:
 *      type: string
 *      description: min 2, max 2, required, uppercase
 *     gender:
 *      type: string
 *      description: requred
 *     profile_image:
 *      type: string
 *      description: max 200
 *     profile_text:
 *      type: string
 *      description: max 300
 *  RegisterResponse:
 *    type: object
 *    properties:
 *      register_success:
 *        type: boolean
 *      register_auth:
 *        type: boolean
 *  RegisterDuplicateResponse:
 *    type: object
 *    properties:
 *      check_email_id:
 *        type: boolean
 *      err:
 *        type: string
 *  LoginRequest:
 *    type: object
 *    properties:
 *      email:
 *        type: string
 *      password:
 *        type: string
 *  LoginResponse:
 *    type: object
 *    properties:
 *      login_success:
 *        type: boolean
 *      user_id:
 *        type: string
 *  LogoutResponse:
 *    type: object
 *    properties:
 *      logout_success:
 *        type: boolean
 *      err:
 *        type: string
 *  UpdateProfileImageRequest:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      profile_image:
 *        type: string
 *  UpdateProfileImageResponse:
 *    type: object
 *    properties:
 *      upload_profileImage_success:
 *        type: boolean
 *      err:
 *        type: string
 *  UpdateProfileTextRequest:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      profile_text:
 *        type: string
 *  UpdateProfileTextResponse:
 *    type: object
 *    properties:
 *      upload_profileText_success:
 *        type: boolean
 *      err:
 *        type: string
 *  UpdateUserInfoRequest:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      name:
 *        type: string
 *      native_language:
 *        type: string
 *      target_language:
 *        type: string
 *      gender:
 *        type: string
 *  UpdateUserInfoResponse:
 *    type: object
 *    properties:
 *      update_user_success:
 *        type: boolean
 *      err:
 *        type: string
 *  ConfirmPasswordRequest:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      passowrd:
 *        type: string
 *  ConfirmPasswordResponse:
 *    type: object
 *    properties:
 *      confirm_password_success:
 *        type: boolean
 *      err:
 *        type: string
 *  UpdatePasswordRequest:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      passowrd:
 *        type: string
 *      new_passowrd:
 *        type: string
 *  UpdatePasswordResponse:
 *    type: object
 *    properties:
 *      update_password_success:
 *        type: boolean
 *      err:
 *        type: string
 *  DeleteUserRequest:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *  DeleteUserResponse:
 *    type: object
 *    properties:
 *      delete_user_success:
 *        type: boolean
 *      err:
 *        type: string
 *  DisplayOneUserResponse:
 *    type: object
 *    properties:
 *      display_user_success:
 *        type: boolean
 *      user:
 *        type: object
 *        properties:
 *          _id:
 *            type: string
 *          email:
 *            type: string
 *          name:
 *            type: string
 *          native_language:
 *            type: string
 *          target_language:
 *            type: string
 *          gender:
 *            type: string
 *          register_date:
 *            type: string
 *          profile_image:
 *            type: string
 *          profile_text:
 *            type: string

 *  DisplayUserListResponse:
 *    type: object
 *    properties:
 *      display_user_list_success:
 *        type: boolean
 *      user_list:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *            email:
 *              type: string
 *            name:
 *              type: string
 *            native_language:
 *              type: string
 *            target_language:
 *              type: string
 *            profile_image:
 *              type: string
*/
