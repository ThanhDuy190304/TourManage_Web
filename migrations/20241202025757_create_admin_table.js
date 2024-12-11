/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('admins', (table) => {
        table.specificType('admin_id', 'CHAR(4)').primary();  // Khóa chính là admin_id kiểu CHAR(4)
        table.specificType('user_id', 'CHAR(20)').unique().references('user_id').inTable('users');  // Khóa ngoại liên kết với bảng users
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('admins');
};
