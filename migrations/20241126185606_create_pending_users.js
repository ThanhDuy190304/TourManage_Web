/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    return await knex.schema.createTable('pending_users', (table) => {
        table.string('user_name', 50).notNullable().unique();
        table.string('email', 100).primary();
        table.specificType('user_password', 'text').notNullable();
        table.specificType('verification_token', 'text').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    return await knex.schema.dropTableIfExists('pending_users');
};