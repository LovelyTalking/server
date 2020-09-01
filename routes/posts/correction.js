const router = require('express').Router();
const correctionServices = require('../../services/posts/correction.service');
const { validateCorrection } = require('../../middlewares/validator/validator')


/**
 * @swagger
 * tags:
 *   name: Correction
 *   description: This is Correction API specification
*/

/**
 * @swagger
 * /posts/correction/upload:
 *   post:
 *     summary: upload correction
 *     tags: [Correction]
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       required: true
 *       schema:
 *         type: object
 *         $ref: '#/definitions/UploadCorrectionRequest'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             upload_correction_success:
 *               type: boolean
 *             uploaded_correction:
 *               type: object
 *               $ref: '#/definitions/DisplayCorrectionResponse'
*/
router.post('/upload', validateCorrection, correctionServices.uploadCorrection);


/**
 * @swagger
 * /posts/correction/delete/{_id}/{post_id}:
 *   get:
 *     summary: update correction info like delete
 *     tags: [Correction]
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
 *             delete_correction_success:
 *               type: boolean
 *             deleted_correction:
 *               type: object
 *               $ref: '#/definitions/DisplayCorrectionResponse'
*/
router.get('/delete/:_id/:post_id', validateCorrection, correctionServices.deleteCorrection);


/**
 * @swagger
 * /posts/correction/display/{post_id}/{page_index}/{page_size}:
 *   get:
 *     summary: display correction list using post id
 *     tags: [Correction]
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
 *             display_correction_list_success:
 *               type: boolean
 *             next_page_index:
 *               type: number
 *             correction_list:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/DisplayCorrectionListResponse'
*/
router.get('/display/:post_id/:page_index/:page_size',validateCorrection,  correctionServices.displayCorrectionList);

module.exports = router;

/**
 * @swagger
 * definitions:
 *   UploadCorrectionRequest:
 *     type: object
 *     properties:
 *       post_id:
 *         type: string
 *       correction_context:
 *         type: string
 *       word_index_arr:
 *         type: array
 *         items:
 *   DisplayCorrectionResponse:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       correction_by:
 *         type: string
 *       correction_context:
 *         type: string
 *       word_index_arr:
 *         type: array
 *         items:
 *           type: number
 *       del_ny:
 *         type: boolean
 *       register_date:
 *         type: string
 *       annotation_size:
 *         type: number
 *   DisplayCorrectionListResponse:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       correction_by:
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
 *       word_index_arr:
 *         type: array
 *         items:
 *           type: number
 *       correction_context:
 *         type: string
 *       del_ny:
 *         type: boolean
 *       register_date:
 *         type: string
 */
