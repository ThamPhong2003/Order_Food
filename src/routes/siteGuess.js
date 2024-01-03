//tạo router từ framework có sẵn express
const express = require('express');
const router = express.Router();

const siteGuessController = new  require('../app/controllers/siteGuessController');



router.get('/login', siteGuessController.loginSite);
router.get('/login/register', siteGuessController.register);
router.get('/:slug',siteGuessController.product)

router.get('/', siteGuessController.home);



module.exports = router;
