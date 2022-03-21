const express = require('express');
const router = express.Router();
const { getPictures, addPicture, deletePicture, getTodayBlurryPicture } = require('../controllers/picture_controller');

router
    .route('/')
    .get(getPictures)
    .post(addPicture);

router
    .route('/:id')
    .delete(deletePicture);

router
    .route('/today/:id')
    .get(getTodayBlurryPicture);

module.exports = router;
