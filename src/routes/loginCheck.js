//tạo router từ framework có sẵn express
const express = require('express');
const router = express.Router();

const loginCheckController = new  require('../app/controllers/checkAcc');


router.post('/', loginCheckController.loginCheck);

module.exports = router;
