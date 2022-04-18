const express = require('express');
const router = express.Router();
const { getPictures, addPicture, deletePicture, getBlurryPicture, guessPicture } = require('../controllers/picture_controller');

router
    .route('/')
    .get(getPictures)
    .post(addPicture);

router
    .route('/:id')
    .delete(deletePicture);

router
    .route('/:date/:currentRound')
    .get(getBlurryPicture);

router
    .route('/:date/guess')
    .post(guessPicture);

module.exports = router;
