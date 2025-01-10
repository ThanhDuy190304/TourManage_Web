const express = require('express');
const router = express.Router();
const cartController = require('../modules/cart/cartController');


router.get('/', cartController.getCartItems);

router.get('/ajaxCartItems', cartController.ajaxCartItems);

router.post('/api/addToCart', cartController.addToCart);

router.post('/api/changeQuantityCartItems', cartController.changeQuantityCartItems);

router.post('/api/deleteCartItems', cartController.deleteCartItems);
router.post('/sync', cartController.syncCartWithDB);
module.exports = router;