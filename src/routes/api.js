const express = require('express');
const router = express.Router();


const cartController = require('../app/controllers/cartController')

router.delete('/deleteCartItem/:id', cartController.deleteFood);
router.delete('/clearCart/:id', cartController.clearCart);
router.post('/addToCart', cartController.addCart);
router.post('/createBill',cartController.order)
module.exports = router;
