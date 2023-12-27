//tạo router từ framework có sẵn express
const express = require('express');
const router = express.Router();

const siteController = new  require('../app/controllers/siteController');

router.get('/', siteController.home);

module.exports = router;
