const router = require('express').Router();
const correctionServices = require('../../services/posts/correction.service');
const { validateCorrection } = require('../../middlewares/validator/validator')

router.post('/upload', validateCorrection, correctionServices.uploadCorrection);

router.get('/delete/:_id/:post_id', validateCorrection, correctionServices.deleteCorrection);

router.get('/display/:post_id/:page_index/:page_size',validateCorrection,  correctionServices.displayCorrectionList);

module.exports = router;
