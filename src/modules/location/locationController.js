// src/tour/locationController.js
const Location = require('./locationModel'); // Import model Location

const locationController = {
    // Hàm lấy thông tin location theo tên
    getLocationByName: async (req, res) => {
        const { location_name } = req.params; // Lấy location_name từ URL

        try {
            const location = await Location.getLocationByName(location_name); // Gọi hàm model để lấy dữ liệu
            if (location.length === 0) {
                return res.status(404).json({ error: 'Location not found' }); // Nếu không tìm thấy location
            }
            res.status(200).json(location); // Trả về thông tin location dưới dạng JSON
        } catch (err) {
            res.status(500).json({ error: err.message }); // Bắt lỗi và trả về mã lỗi 500
        }
    },

    // Hàm lấy tất cả các locations
    getAllLocations: async (req, res) => {
        try {
            const locations = await Location.getAllLocations(); // Gọi hàm model để lấy dữ liệu
            res.status(200).json(locations); // Trả về danh sách locations dưới dạng JSON
        } catch (err) {
            res.status(500).json({ error: err.message }); // Bắt lỗi và trả về mã lỗi 500
        }
    },

};

module.exports = locationController;
