/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    return await knex.schema.table('detail_reservations', function (table) {
        table.specificType('detail_tour_id', 'char(4)');
        table.foreign(['tour_id', 'detail_tour_id'])
            .references(['tour_id', 'detail_tour_id'])
            .inTable('detail_tours');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    return await knex.schema.table('detail_reservations', function (table) {
        // Xóa khóa ngoại trước khi xóa cột
        table.dropForeign(['tour_id', 'detail_tour_id']);

        // Xóa cột detail_tour_id
        table.dropColumn('detail_tour_id');
    });
};
