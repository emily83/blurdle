const express = require('express');
const router = express.Router();

const { login } = require('../controllers/admin_controller');

// router
//     .route('/register')
//     .post(register);

router
    .route('/login')
    .post(login);

module.exports = router;