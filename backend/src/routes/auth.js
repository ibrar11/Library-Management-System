const express = require('express');
const authController = require('../controllers/authController');

const router = express();

router.route('/login')
        .post(authController.handleLogin)

router.route('/logout')
        .put(authController.handleLogout)

module.exports = router;