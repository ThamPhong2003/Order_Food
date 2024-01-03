//tạo router từ framework có sẵn express
const express = require('express');
const router = express.Router();

const siteController = new  require('../app/controllers/siteController');



router.get('/:id', siteController.home);
router.get('/:id/cart', siteController.cart);
router.get('/:id/:slug', siteController.product);



module.exports = router;
