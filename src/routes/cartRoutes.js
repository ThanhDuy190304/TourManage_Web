const express = require('express');
const router = express.Router();
const cartController = require('../modules/cart/cartController');

router.get('/', (req, res) => {
    res.render('shoppingCart', {
        layout: 'main',
        user: JSON.stringify(res.locals.user),
        title: 'Shopping Cart Page',
        // scripts: '<script src="/js/cart.js"></script>',
    });
});

router.get('/getCartByUserid/:userID',cartController.getCartByUserid);

router.get('/getCartItemByUserID/:userID',cartController.getCartItemByUserID);

router.post('/deleteCartItem',cartController.deleteCartItem);

router.post('/updateCartItem',cartController.updateCartItem);

router.post('/addCartItem',cartController.addCartItem);

router.get('/getNextCIID',cartController.getNextCartItem);

router.post('/addReservationDetail',cartController.addReservationDetail);

router.post('/addReservation',cartController.addReservation);

router.get('/getNextRID',cartController.getNextRID);

router.get('/getNextRDID',cartController.getNextRDID);


module.exports = router;