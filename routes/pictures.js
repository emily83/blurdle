const express = require('express');
const router = express.Router();
const { getPictures, addPicture, changePicture, deletePicture, getBlurryPicture, guessPicture, getNextFreeDate } = require('../controllers/picture_controller');

router
    .route('/')
    .get(getPictures)
    .post(addPicture);

router
    .route('/:id')
    .put(changePicture)
    .delete(deletePicture);

router
    .route('/:date/:currentRound')
    .get(getBlurryPicture);

router
    .route('/:date/guess')
    .post(guessPicture);

router
    .route('/nextFreeDate')
    .get(getNextFreeDate);

module.exports = router;
