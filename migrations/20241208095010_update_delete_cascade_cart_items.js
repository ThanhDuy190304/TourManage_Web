/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.alterTable('cart_items', (table) => {
        // Xóa khóa ngoại cũ với ['tour_id', 'detail_tour_id']
        table.dropForeign(['tour_id', 'detail_tour_id']);

        // Thêm lại khóa ngoại với ON DELETE CASCADE
        table.foreign(['tour_id', 'detail_tour_id'])
            .references(['tour_id', 'detail_tour_id'])
            .inTable('detail_tours')
            .onDelete('CASCADE'); // Nếu tour chi tiết bị xóa, xóa cả trong cart_items
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.alterTable('cart_items', (table) => {
        // Xóa khóa ngoại hiện tại
        table.dropForeign(['tour_id', 'detail_tour_id']);

        // Thêm lại khóa ngoại không có ON DELETE CASCADE
        table.foreign(['tour_id', 'detail_tour_id'])
            .references(['tour_id', 'detail_tour_id'])
            .inTable('detail_tours');
    });
};
