const cartModel = require('./cartModel');
const cartController = {
    getNextCartItem: async (req, res) => {
        try {
            const nextCIID = await cartModel.getNextCartItem();
            res.json(nextCIID);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getNextRID: async (req, res) => {
        try {
            const nextRID = await cartModel.getNextRID();
            res.json(nextRID);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getNextRDID: async (req, res) => {
        try {
            const nextRID = await cartModel.getNextRDID();
            res.json(nextRID);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    
    getNextRDID: async (req, res) => {
        try {
            const nextRDID = await cartModel.getNextRDID();
            res.json(nextRDID);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getCartItemByUserID: async (req, res) => {
        try {
            const {userID} = req.params
            const cart_user = await cartModel.getCartItemByUserID(userID);
            res.json(cart_user);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getCartByUserid: async (req, res) => {
        try {
            const {userID} = req.params
            const cart_user = await cartModel.getCartByUserid(userID);
            res.json(cart_user);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    deleteCartItem: async (req, res) => {
        try {
            const { user_id, tour_id} = req.body;
            // const branchDish = await Reserve.submitReserveDish(idBranch);
            // res.json(branchDish);
            // Xử lý dữ liệu đơn hàng (lưu vào cơ sở dữ liệu, tính toán, v.v.)
            await cartModel.deleteCartItem(user_id, tour_id);
            // Gửi phản hồi cho client
            res.status(200).send({ message: 'Update successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updateCartItem: async (req, res) => {
        try {
            const { user_id, tour_id,quantity,price} = req.body;
            // const branchDish = await Reserve.submitReserveDish(idBranch);
            // res.json(branchDish);
            // Xử lý dữ liệu đơn hàng (lưu vào cơ sở dữ liệu, tính toán, v.v.)
            await cartModel.updateCartItem( user_id, tour_id,quantity, price);
            // Gửi phản hồi cho client
            res.status(200).send({ message: 'Update successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    addCartItem: async (req, res) => {
        try {
            const { nextCIID, CartID,TourID,quantity, price} = req.body;
            // const branchDish = await Reserve.submitReserveDish(idBranch);
            // res.json(branchDish);
            // Xử lý dữ liệu đơn hàng (lưu vào cơ sở dữ liệu, tính toán, v.v.)
            await cartModel.addCartItem( nextCIID, CartID,TourID,quantity, price);
            // Gửi phản hồi cho client
            res.status(200).send({ message: 'Order submitted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    addReservationDetail: async (req, res) => {
        try {
            const { reservationID, detailReservationID,userID,tourID,quantity, price} = req.body;
            // const branchDish = await Reserve.submitReserveDish(idBranch);
            // res.json(branchDish);
            // Xử lý dữ liệu đơn hàng (lưu vào cơ sở dữ liệu, tính toán, v.v.)
            await cartModel.addReservationDetail( reservationID, detailReservationID,userID,tourID,quantity, price);
            // Gửi phản hồi cho client
            res.status(200).send({ message: 'Order submitted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },



};

module.exports = cartController;