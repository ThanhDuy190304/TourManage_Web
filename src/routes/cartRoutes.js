const express = require('express');
const router = express.Router();
const cartController = require('../modules/cart/cartController');


router.get('/', cartController.getCartItems);

router.post('/api/addToCart', cartController.addToCart);


module.exports = router;