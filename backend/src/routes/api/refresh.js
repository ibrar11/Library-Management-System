const express = require('express');
const refreshController = require('../../controllers/refreshController');

const router = express();

router.route('/')
        .get(refreshController.refreshToken);

module.exports = router;