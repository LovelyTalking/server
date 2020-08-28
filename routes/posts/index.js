const router = require('express').Router();
const postList = require('./display.postList');
const comment = require('./comment');
const correction = require('./correction');
const postServices = require('../../services/posts/post.service')
const { AuthContainer } = require('../../middlewares/auth/auth')
const { validatePost} = require('../../middlewares/validator/validator')

const authToken = AuthContainer.get("auth.User");

router.use(authToken);

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: This is Post API specification
*/

/**
 * @swagger
 * /posts/upload:
 *   post:
 *     summary: upload post
 *     tags: [Post]
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       required: true
 *       schema:
 *         type: object
 *         $ref: '#/definitions/UploadPostRequest'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             post_upload_success:
 *               type: boolean
 *             uploaded_post:
 *               type: object
 *               $ref: '#/definitions/DisplayPostResponse'
*/
router.post('/upload', validatePost, postServices.uploadPost);

/**
 * @swagger
 * /posts/display/{_id}:
 *   get:
 *     summary: display one post info
 *     tags: [Post]
 *     parameters:
 *     - in: "path"
 *       name: "_id"
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             display_one_post:
 *               type: boolean
 *             postInfo:
 *               type: object
 *               $ref: '#/definitions/DisplayPostResponse'
*/
router.get('/display/:_id',  validatePost, postServices.displayOnePost);

/**
 * @swagger
 * /posts/update:
 *   post:
 *     summary: update post
 *     tags: [Post]
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       required: true
 *       schema:
 *         type: object
 *         $ref: '#/definitions/UpdateRequest'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             update_post_success:
 *               type: boolean
 *             updated_post:
 *               type: object
 *               $ref: '#/definitions/DisplayPostResponse'
*/
router.post('/update',  validatePost, postServices.updatePost);

/**
 * @swagger
 * /posts/delete/{_id}:
 *   get:
 *     summary: update post info like delete
 *     tags: [Post]
 *     parameters:
 *     - in: "path"
 *       name: "_id"
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             delete_post_success:
 *               type: boolean
 *             deleted_post:
 *               type: object
 *               $ref: '#/definitions/DisplayPostResponse'
*/
router.get('/delete/:_id',  validatePost, postServices.deletePost);

router.use('/display/list', postList);
router.use('/comment',comment);
router.use('/correction',correction);

module.exports = router;


/**
 * @swagger
 * definitions:
 *   UploadPostRequest:
 *     type: object
 *     properties:
 *       posted_by:
 *         type: string
 *       post_context:
 *         type: string
 *       hashtags:
 *         type: array
 *         items:
 *           type:string
 *       post_images:
 *         type: array
 *         items:
 *           type:string
 *   DisplayPostResponse:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       posted_by:
 *         type: object
 *         properties:
 *           _id:
 *             type: string
 *           email:
 *             type: string
 *           name:
 *             type: string
 *           native_language:
 *             type: string
 *           target_language:
 *             type: string
 *           gender:
 *             type: string
 *           profile_image:
 *             type: string
 *           profile_text:
 *             type: string
 *       native_language:
 *         type: string
 *       target_language:
 *         type: string
 *       post_context:
 *         type: string
 *       post_images:
 *         type: array
 *         items:
 *           type: string
 *       hashtags:
 *         type: array
 *         items:
 *           type: string
 *       like_users:
 *         type: array
 *         items:
 *           type: string
 *       count_like:
 *         type: number
 *       annotation_users:
 *         type: array
 *         items:
 *           type: string
 *       count_annotation:
 *         type: number
 *   UpdateRequest:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       posted_by:
 *         type: string
 *       post_context:
 *         type: string
 *       hashtags:
 *         type: array
 *         items:
 *           type:string
 *       post_images:
 *         type: array
 *         items:
 *           type:string

*/
