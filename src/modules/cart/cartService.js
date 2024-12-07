const cartModel = require('./cartModel');
const tourModel = require(`../tour/tourModel`);
const userModel = require(`../user/userModel`);
class CartService {

    static async addTourToUserCart(userId, tourId, scheduleId, quantity) {
        try {
            let touristId = await userModel.getTouristId(userId);
            let cartId = await cartModel.getCartId(touristId);
            let checkExistsCartItem = await cartModel.checkExistsCartItem(cartId, tourId, scheduleId);
            if (checkExistsCartItem) {
                await cartModel.increaseCartItemQuantity(cartId, tourId, scheduleId, quantity);
            } else {
                await cartModel.insertCartItem(cartId, tourId, scheduleId, quantity);
            }
        } catch (error) {
            console.log(`Error in cartService: `, error.message);
            throw new Error(`Failed to add this item to cart`);
        }
    }

    static async getItemCountsOfUserCart(userId) {
        try {
            let touristId = await userModel.getTouristId(userId);
            let cartId = await cartModel.getCartId(touristId);
            let count = await cartModel.getItemCounts(cartId);
            return count;
        } catch (error) {
            console.log(`Error getItemCounts in cartService: `, error.message);
            throw new Error(`Failed to get item counts of cart`);
        }

    }
    static async syncCartWithDB(userId, cartDataArray) {
        try {
            let touristId = await userModel.getTouristId(userId);
            let cartId = await cartModel.getCartId(touristId);

            for (let item of cartDataArray) {
                const { tourId, scheduleId, quantity } = item;

                let checkExistsCartItem = await cartModel.checkExistsCartItem(cartId, tourId, scheduleId);

                if (checkExistsCartItem) {
                    await cartModel.increaseCartItemQuantity(cartId, tourId, scheduleId, quantity);
                } else {
                    await cartModel.insertCartItem(cartId, tourId, scheduleId, quantity);
                }
            }

        } catch (error) {
            console.log(`Error syncCartWithDB in cartService: `, error.message);
            throw new Error(`Failed syncing the cart with the database`);
        }
    }

    static async getUserCartItems(userId) {
        try {
            let touristId = await userModel.getTouristId(userId);
            let cartId = await cartModel.getCartId(touristId);
            let cartItems = await cartModel.getCartItems(cartId);
            cartItems = cartItems.map(item => {
                if (item.tourDate) {
                    item.tourDate = new Date(item.tourDate).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    });
                }
                return item;
            });
            return cartItems;
        }
        catch (error) {
            console.log(`Error getUserCartItems in cartService: `, error.message);
            throw new Error(`Failed getting items of cart`);
        }
    }

    static async getCartItems(cartDataArray) {
        if (!Array.isArray(cartDataArray) || cartDataArray.length === 0) {
            return null;
        }
        const cartPromises = cartDataArray.map(async (item) => {
            const { tourId, scheduleId } = item;
            const tourDetail = await tourModel.getTourScheduleDetail(tourId, scheduleId);
            const formattedTourDate = tourDetail.tourDate ? new Date(tourDetail.tourDate).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }) : null;
            return {
                ...item, // Thêm các thuộc tính từ cartDataArray vào kết quả
                ...tourDetail,// Thêm các chi tiết tour từ phương thức getTourScheduleDetail
                tourDate: formattedTourDate,
            };
        });

        const cartItemsWithDetails = await Promise.all(cartPromises);
        return cartItemsWithDetails;
    }


}

module.exports = CartService;
