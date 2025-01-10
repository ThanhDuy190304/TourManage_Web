const cartModel = require('./cartModel');
const tourModel = require(`../tour/tourModel`);

const { format } = require('date-fns');
const { vi } = require('date-fns/locale');

class CartService {

    static async addTourToUserCart(touristId, tourId, scheduleId, quantity) {
        try {
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

    static async getItemCountsOfUserCart(touristId) {
        try {
            let cartId = await cartModel.getCartId(touristId);
            let count = await cartModel.getItemCounts(cartId);
            return count;
        } catch (error) {
            console.log(`Error getItemCounts in cartService: `, error.message);
            throw new Error(`Failed to get item counts of cart`);
        }

    }
    static async syncCartWithDB(touristId, cartDataArray) {
        try {
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

    static async getUserCartItems(touristId) {
        try {
            let cartId = await cartModel.getCartId(touristId);
            let cartItems = await cartModel.getCartItems(cartId);

            if (cartItems == null) return [];

            cartItems = cartItems.map(item => {
                if (item.tourDate) {
                    item.tourDate = format(new Date(item.tourDate), 'dd-MM-yyyy', { locale: vi });
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
            return [];
        }
        const cartPromises = cartDataArray.map(async (item) => {
            const { tourId, scheduleId } = item;
            const tourDetail = await tourModel.getTourScheduleDetail(tourId, scheduleId);
            const formattedTourDate = tourDetail.tourDate ?
                format(new Date(tourDetail.tourDate), 'dd-MM-yyyy', { locale: vi }) : null;

            return {
                ...item, // Thêm các thuộc tính từ cartDataArray vào kết quả
                ...tourDetail,// Thêm các chi tiết tour từ phương thức getTourScheduleDetail
                tourDate: formattedTourDate,
            };
        });

        const cartItemsWithDetails = await Promise.all(cartPromises);
        return cartItemsWithDetails;
    }

    static async changeQuantityCartItems(touristId, tourId, scheduleId, quantity) {
        try {
            let cartId = await cartModel.getCartId(touristId);

            let checkExistsCartItem = await cartModel.checkExistsCartItem(cartId, tourId, scheduleId);

            if (checkExistsCartItem) {
                await cartModel.increaseCartItemQuantity(cartId, tourId, scheduleId, quantity);
            }

        } catch (error) {
            console.log(`Error changeQuantityCartItems in cartService: `, error.message);
            throw new Error(`Failed changeQuantityCartItems the cart with the database`);
        }
    }

    static async deleteCartItems(touristId, tourId, scheduleId) {
        try {
            let cartId = await cartModel.getCartId(touristId);

            let checkExistsCartItem = await cartModel.checkExistsCartItem(cartId, tourId, scheduleId);

            if (checkExistsCartItem) {
                await cartModel.deleteCartItems(cartId, tourId, scheduleId);
            }

        } catch (error) {
            console.log(`Error delete cart item in cartService: `, error.message);
            throw new Error(`Failed delete cart item the cart with the database`);
        }
    }

}

module.exports = CartService;
