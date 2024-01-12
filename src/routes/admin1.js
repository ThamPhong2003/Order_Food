//tạo router từ framework có sẵn express
const express = require('express');
const router = express.Router();

const admin1Controller = new  require('../app/controllers/admin1Controller');

router.get('/:id/editFood', admin1Controller.editFood);
router.get('/listFood', admin1Controller.listFood);
router.get('/historyBill', admin1Controller.historyBill);
router.get('/createFood', admin1Controller.creatFood);
router.post('/addFood', admin1Controller.addFood);
router.get('/detail/:slug',admin1Controller.detailBill)
router.get('/detailBillHistory/:slug',admin1Controller.detailBillHistory)
router.delete('/bill/:id', admin1Controller.doneBill);
router.put('/:id', admin1Controller.updateFood);
router.delete('/:id', admin1Controller.deleteFood);
router.delete('/billHistory/:id', admin1Controller.deletedBillHistory);
router.post('/loginCheckAdmin', admin1Controller.loginCheck);
router.get('/', admin1Controller.home);



module.exports = router;
