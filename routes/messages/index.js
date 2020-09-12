const router = require('express').Router();
const messageServices = require('../../services/messages/message.service')
const { AuthContainer } = require('../../middlewares/auth/auth');
// TODO: To make validate message middleware
const { validateUser} = require('../../middlewares/validator/validator');

const authToken = AuthContainer.get('auth.User');

router.use(authToken);
//router.use(validateMessage);


/**
 * @swagger
 * tags:
 *  name: Message Room
 *  description: This is User API specification
*/

/**
 * @swagger
 * /room/list/{page_index}/{page_size}:
 *   get:
 *     summary: request room list about user
 *     tags: [Message Room]
 *     parameters:
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
 *             display_room_list_success:
 *               type: boolean
 *             room_list:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/DisplayRoomResponse'
*/
router.get('/room/list',messageServices.displayRoomList);

/**
 * @swagger
 * /room/create/{user_id}:
 *   get:
 *     summary: create message room with partner
 *     tags: [Message Room]
 *     parameters:
 *     - in: "path"
 *       name: "user_id"
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             create_room_success:
 *               type: boolean
 *             created_room:
 *               $ref: '#/definitions/CreateRoomResponse'
*/
router.get('/room/create/:user_id', messageServices.createMessageRoom);


/**
 * @swagger
 * /room/enter/{room_id}:
 *   get:
 *     summary: enter the message room with socket
 *     tags: [Message Room]
 *     parameters:
 *     - in: "path"
 *       name: "room_id"
 *       required: true
 *       schema:
 *         type: string
 *     - in: "path"
 *       name: "with_user_id"
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             enter_room_success:
 *               type: boolean
 *             message_list:
 *               $ref: '#/definitions/EnterRoomResponse'
*/
router.get('/room/enter/:room_id', messageServices.enterMessageRoom);


/**
 * @swagger
 * /message/{room_id}/send:
 *   post:
 *     summary: send message in room with socket
 *     tags: [Message Room]
 *     parameters:
 *     - in: "path"
 *       name: "room_id"
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             send_message_success:
 *               type: boolean
*/
router.post('/message/:room_id/send', messageServices.sendMessageInRoom);

// @desc 이 기능이 소켓 설정부분에서 처리 가능할 것으로 보인다
router.get('/room/leave/:room_id', messageServices.leaveMessageRoom);

/**
 * @swagger
 * /room/delete/{room_id}:
 *   post:
 *     summary: delete message room
 *     tags: [Message Room]
 *     parameters:
 *     - in: "path"
 *       name: "room_id"
 *       required: true
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             delete_room_success:
 *               type: boolean
*/
router.get('/room/delete/:room_id', messageServices.deleteMessageRoom);

module.exports = router;
/**
 * @swagger
 * definitions:
 *   DisplayRoomResponse:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       users:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             profile_image:
 *               type: string
 *       user_state:
 *         type: object
 *         properties:
 *           user_a_id:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               room_info:
 *                 type: string
 *               user_info:
 *                 type: string
 *               is_out:
 *                 type: string
 *               room_out_date:
 *                 type: string
 *               unread_cnt:
 *                 type: string
 *               is_online:
 *                 type: string
 *           user_b_id:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               room_info:
 *                 type: string
 *               user_info:
 *                 type: string
 *               is_out:
 *                 type: string
 *               room_out_date:
 *                 type: string
 *               unread_cnt:
 *                 type: string
 *               is_online:
 *                 type: string
 *       register_date:
 *         type: string
 *       update_date:
 *         type: string
 *   CreateRoomResponse:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       users:
 *         type: array
 *         items:
 *           type: string
 *       uesr_state:
 *         type: object
 *         properties:
 *           user_a_id:
 *             type: string
 *           user_b_id:
 *             type: string
 *       register_date:
 *         type: string
 *       update_date:
 *         type: string
 *   EnterRoomResponse:
 *     type: array
 *     items:
 *       type: object
 *       properties:
 *         send_by:
 *           type: string
 *         message:
 *           type: string
 *         register_date:
 *           type: string
*/
