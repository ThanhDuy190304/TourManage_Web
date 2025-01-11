/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Thêm cột vào bảng reservations
    await knex.schema.alterTable('reservations', (table) => {
        table.string('tourist_name');
        table.string('tourist_contact');
    });
    await knex.schema.alterTable('detail_reservations', (table) => {
        table.dropColumn('tourist_name');
        table.dropColumn('tourist_contact');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {

    await knex.schema.alterTable('detail_reservations', (table) => {
        table.string('tourist_name');
        table.string('tourist_contact');
    });
    // Xóa cột ở bảng reservations
    await knex.schema.alterTable('reservations', (table) => {
        table.dropColumn('tourist_name');
        table.dropColumn('tourist_contact');
    });
};
