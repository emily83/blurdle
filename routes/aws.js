const express = require('express');
const router = express.Router();
const { signS3Put } = require('../controllers/aws_controller');

router
    .route('/sign-s3-put')
    .get(signS3Put);

module.exports = router;