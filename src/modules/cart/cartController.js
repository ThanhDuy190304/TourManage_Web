const cartService = require("./cartService");

class CartController {
    static async addToCart(req, res) {
        try {
            const user = res.locals.user;
            const { tourId, scheduleId, quantity } = req.body;

            if (!user) {
                return res.status(401).json({
                    success: true,
                });
            }
            else {
                await cartService.addTourToUserCart(user.userId, tourId, scheduleId, quantity);
                let count = String(await cartService.getItemCountsOfUserCart(user.userId));
                return res.status(200).json({ success: true, count: count });
            }

        } catch (error) {
            console.error("Error in cartController:", error.message);
            return res.status(500).json({
                success: false,
                message: 'Failed to add to cart. Please try again later.'
            });

        }
    }

    static async getCartItems(req, res) {
        try {
            const user = res.locals.user;
            if (!user) {
                const cartDataArray = JSON.parse(req.query.cartDataArray || '[]');
                let cartItems = await cartService.getCartItems(cartDataArray);
                res.render('shoppingCart', {
                    layout: 'main',
                    cartItems: cartItems,
                    title: 'Shopping Cart Page',
                });

            } else {
                let cartItems = await cartService.getUserCartItems(user.userId);
                res.render('shoppingCart', {
                    layout: 'main',
                    cartItems: cartItems,
                    title: 'Shopping Cart Page',
                });
            }

        } catch (error) {
            console.error("Error in cartController:", error.message);
            return res.status(500).json({
                message: 'Failed to get cart items of user. Please try again later.'
            });
        }

    }

    static async ajaxCartItems(req, res) {
        try {
            const user = res.locals.user;
            if (!user) {
                const cartDataArray = JSON.parse(req.query.cartDataArray || '[]');
                console.log(cartDataArray)
                let cartItems = await cartService.getCartItems(cartDataArray);
                return res.json(cartItems);
            } else {
                let cartItems = await cartService.getUserCartItems(user.userId) || [];
                return res.json(cartItems);
            }
        } catch (error) {
            console.error("Error in cartController:", error.message);
            return res.status(500).json({
                message: 'Failed to get cart items of user. Please try again later.'
            });
        }
    }

    static async changeQuantityCartItems(req, res) {
        try {
            const user = res.locals.user;
            const { tourId, scheduleId, quantity } = req.body;
            if (!user) {
                return res.status(401).json({
                    success: true,
                });
            } else {
                await cartService.changeQuantityCartItems(user.userId, tourId, scheduleId, quantity);
                return res.status(200).json({ success: true});
            }

        } catch (error) {
            console.error("Error in cartController:", error.message);
            return res.status(500).json({
                message: 'Failed to get cart items of user. Please try again later.'
            });
        }
    }

    static async deleteCartItems(req, res) {
        try {
            const user = res.locals.user;
            const { tourId, scheduleId} = req.body;
            if (!user) {
                return res.status(401).json({
                    success: true,
                });
            } else {
                await cartService.deleteCartItems(user.userId, tourId, scheduleId);
                return res.status(200).json({ success: true});
            }

        } catch (error) {
            console.error("Error in cartController:", error.message);
            return res.status(500).json({
                message: 'Failed to deletes cart item of user. Please try again later.'
            });
        }
    }
}

module.exports = CartController;
