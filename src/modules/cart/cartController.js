const cartService = require("./cartService");
const userService = require('../user/userService');
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
                let touristId = await userService.getTouristId(user.userId);
                await cartService.addTourToUserCart(touristId, tourId, scheduleId, quantity);
                let count = String(await cartService.getItemCountsOfUserCart(touristId));
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
                let touristId = await userService.getTouristId(user.userId);
                let cartItems = await cartService.getUserCartItems(touristId);
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
                let touristId = await userService.getTouristId(user.userId);
                let cartItems = await cartService.getUserCartItems(touristId) || [];
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
                let touristId = await userService.getTouristId(user.userId);
                await cartService.changeQuantityCartItems(touristId, tourId, scheduleId, quantity);
                return res.status(200).json({ success: true });
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
            const { tourId, scheduleId } = req.body;
            if (!user) {
                return res.status(401).json({
                    success: true,
                });
            } else {
                let touristId = await userService.getTouristId(user.userId);
                await cartService.deleteCartItems(touristId, tourId, scheduleId);
                return res.status(200).json({ success: true });
            }

        } catch (error) {
            console.error("Error in cartController:", error.message);
            return res.status(500).json({
                message: 'Failed to deletes cart item of user. Please try again later.'
            });
        }
    }

    static async syncCartWithDB(req, res) {
        try {
            const user = res.locals.user;
            const cartDataArray = req.body.cartDataArray;
            if (!user) {
                return res.status(401).json({
                    message: 'Unauthorized',
                });
            }
            if (!cartDataArray) {
                return res.status(400).json({
                    message: 'Bad request',
                });
            }
            let countItem = 0;
            if (user.userRole === 2) {
                const touristId = await userService.getTouristId(user.userId);
                if (cartDataArray.length > 0) {
                    await cartService.syncCartWithDB(touristId, cartDataArray);
                }
                countItem = await cartService.getItemCountsOfUserCart(touristId);
            }
            console.log(countItem);
            return res.status(200).json({ countItem: countItem });
        } catch (error) {
            console.error("Error in cartController.syncCartWithDB:", error.message);
            return res.status(500).json({
                message: 'Failed to sync cart with database. Please try again later.'
            });
        }
    }
}

module.exports = CartController;
