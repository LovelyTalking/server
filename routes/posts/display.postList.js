const router = require('express').Router();
const postDisplayListServices = require('../../services/posts/display.postList.service');
const { validatePost} = require('../../middlewares/validator/validator')
/*
  @desc TODO: 포스트 리스트를 보여줘야하는 경우는 총 3가지
  1) 유저 별 포스트리스트
  2) native 와 target language 별 포스트 리스트
  3) 해시태그 별 포스트 리스트
*/

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: This is Post API specification
*/

/**
 * @swagger
 * /posts/display/list/user/{posted_by}/{page_index}/{page_size}:
 *   get:
 *     summary: display post list using user
 *     tags: [Post]
 *     parameters:
 *     - in: "path"
 *       name: "posted_by"
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
 *             display_postList_user_success:
 *               type: boolean
 *             page_index:
 *               type: number
 *             display_info:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/DisplayPostResponse'
*/
router.get('/user/:posted_by/:page_index/:page_size',validatePost, postDisplayListServices.displayUserRelatedPostList);


/**
 * @swagger
 * /posts/display/list/lang/{native_language}/{target_language}/{page_index}/{page_size}:
 *   get:
 *     summary: display post list using language
 *     tags: [Post]
 *     parameters:
 *     - in: "path"
 *       name: "native_language"
 *       required: true
 *       schema:
 *         type: string
 *     - in: "path"
 *       name: "target_language"
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
 *             display_postList_lang_success:
 *               type: boolean
 *             page_index:
 *               type: number
 *             display_info:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/DisplayPostResponse'
*/
router.get(
  '/lang/:native_language/:target_language/:page_index/:page_size',validatePost,
  postDisplayListServices.displayLangRelatedPostList
);



/**
 * @swagger
 * /posts/display/list/hashtag/{hashtag_name}/{page_index}/{page_size}:
 *   get:
 *     summary: display post list using hashtag
 *     tags: [Post]
 *     parameters:
 *     - in: "path"
 *       name: "hashtag_name"
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
 *             display_postList_hashtag_success:
 *               type: boolean
 *             page_index:
 *               type: number
 *             display_info:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/DisplayPostResponse'
*/
router.get(
  '/hashtag/:hashtag_name/:page_index/:page_size',validatePost,
  postDisplayListServices.displayHashtagRelatedPostList
);

/**
 * @swagger
 * /posts/display/list/like_users/{post_id}/{page_index}/{page_size}:
 *   get:
 *     summary: display user list in post using post_id
 *     tags: [Post]
 *     parameters:
 *     - in: "path"
 *       name: "_id"
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
 *             display_like_userList_success:
 *               type: boolean
 *             page_index:
 *               type: number
 *             display_info:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/DisplayUserlistResponse'
*/
router.get(
  '/like_users/:_id/:page_index/:page_size',validatePost,
  postDisplayListServices.displayLikeUserlistInPost
);

module.exports = router;


/**
 * @swagger
 * definitions:
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
 *         post_context:
 *           type: string
 *         post_images:
 *           type: array
 *           items:
 *             type: string
 *         hashtags:
 *           type: array
 *           items:
 *             type: string
 *         register_date:
 *           type: string
 *   DisplayUserlistResponse:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       name:
 *         type: string
 *       native_language:
 *         type: string
 *       target_language:
 *         type: string
 *       gender:
 *         type: string
 *       profile_image:
 *         type: string
*/
