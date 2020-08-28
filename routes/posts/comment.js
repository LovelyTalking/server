const router = require('express').Router();
const commentServices = require('../../services/posts/comment.service');
const { validateComment } = require('../../middlewares/validator/validator')

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: This is Comment API specification
*/

/**
 * @swagger
 * /posts/comment/upload:
 *   post:
 *     summary: upload comment
 *     tags: [Comment]
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       required: true
 *       schema:
 *         type: object
 *         $ref: '#/definitions/UploadCommentRequest'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             upload_comment_succes:
 *               type: boolean
 *             uploaded_comment:
 *               type: object
 *               $ref: '#/definitions/DisplayCommentResponse'
*/
router.post('/upload', validateComment, commentServices.uploadComment);


/**
 * @swagger
 * /posts/comment/delete/{_id}/{post_id}:
 *   get:
 *     summary: update comment info like delete
 *     tags: [Comment]
 *     parameters:
 *     - in: "path"
 *       name: "_id"
 *       required: true
 *       schema:
 *         type: string
 *     - in: "path"
 *       name: "post_id"
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             delete_comment_success:
 *               type: boolean
 *             deleted_comment:
 *               type: object
 *               $ref: '#/definitions/DisplayCommentResponse'
*/
router.get('/delete/:_id/:post_id', validateComment, commentServices.deleteComment);

/**
 * @swagger
 * /posts/comment/display/{post_id}/{page_index}/{page_size}:
 *   get:
 *     summary: display comment list using post id
 *     tags: [Comment]
 *     parameters:
 *     - in: "path"
 *       name: "post_id"
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
 *         schema:
 *           type: object
 *           properties:
 *             display_comment_list_success:
 *               type: boolean
 *             next_page_index:
 *               type: number
 *             comment_list:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/DisplayCommentListResponse'
*/
router.get('/display/:post_id/:page_index/:page_size', validateComment, commentServices.displayCommentList);

module.exports = router;

/**
 * @swagger
 * definitions:
 *   UploadCommentRequest:
 *     type: object
 *     properties:
 *       post_id:
 *         type: string
 *       comment_context:
 *         type: string
 *   DisplayCommentResponse:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       commented_by:
 *         type: string
 *       comment_context:
 *         type: string
 *       del_ny:
 *         type: boolean
 *       register_date:
 *         type: string
 *       annotation_size:
 *         type: number
 *   DisplayCommentListResponse:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       commented_by:
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
 *       comment_context:
 *         type: string
 *       del_ny:
 *         type: boolean
 *       register_date:
 *         type: string
 */
