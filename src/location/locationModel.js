// src/tour/locationModel.js
const db = require('../config/db'); // Giả sử bạn có một tệp db.js để kết nối với cơ sở dữ liệu

const Location = {
    getLocationByName: async (location_name) => {
        const query = `
            SELECT * FROM locations
            WHERE location_name = $1
        `;
        const values = [location_name];

        const result = await db.query(query, values);
        return result.rows; // Trả về các hàng kết quả
    },

    getAllLocations: async () => {
        const query = `SELECT * FROM locations`;
        const result = await db.query(query);
        return result.rows; // Trả về tất cả các hàng kết quả
    }
};

module.exports = Location;
