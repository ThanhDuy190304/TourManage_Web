/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable('users', function (table) {
        table.specificType('user_password', 'text').alter(); // Chuyển cột password thành kiểu text
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable('users', function (table) {
        table.specificType('user_password', 'character varying(20)').alter(); // Quay lại kiểu varchar(20)
    });
};
