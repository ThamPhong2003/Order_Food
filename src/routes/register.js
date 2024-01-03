//tạo router từ framework có sẵn express
const express = require('express');
const router = express.Router();

const registerController = new  require('../app/controllers/checkAcc');


router.post('/', registerController.registerAcc);

module.exports = router;
