/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    return await knex.schema.createTable('manufacturers', function (table) {
        table.increments('id').primary();  // Tạo cột id tự động tăng và là khóa chính
        table.string('name').notNullable();  // Tạo cột name kiểu chuỗi và không thể null
        table.string('contact').nullable();  // Tạo cột contact kiểu chuỗi và có thể null
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    return await knex.schema.dropTable('manufacturers');
};
