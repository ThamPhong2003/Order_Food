//tạo router từ framework có sẵn express
const express = require('express');
const router = express.Router();

const admin1Controller = new  require('../app/controllers/admin1Controller');

router.get('/:id/editFood', admin1Controller.editFood);
router.get('/listFood', admin1Controller.listFood);
router.get('/createFood', admin1Controller.creatFood);
router.post('/addFood', admin1Controller.addFood);
router.put('/:id', admin1Controller.updateFood);
router.delete('/:id', admin1Controller.deleteFood);


router.get('/', admin1Controller.home);



module.exports = router;
