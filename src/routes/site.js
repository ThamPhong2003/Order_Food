//tạo router từ framework có sẵn express
const express = require('express');
const router = express.Router();
const siteController = new  require('../app/controllers/siteController');



router.get('/:id', siteController.home);
router.get('/:id/cart', siteController.cart);
router.get('/:id/infor/changeInfor', siteController.changeInfor);
router.get('/:id/infor/changePass', siteController.changePass);
router.put('/:id/infor/changeInfor/action',siteController.actionChangeInfor)
router.put('/:id/infor/changePass/action',siteController.actionChangePass)
router.get('/:id/infor', siteController.infor);
router.get('/history/:slug', siteController.historybill);
router.get('/:id/:slug', siteController.product);




module.exports = router;
