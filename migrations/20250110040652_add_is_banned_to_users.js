/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    return await knex.schema.table('users', function (table) {
        table.boolean('is_banned').defaultTo(false);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    return await knex.schema.table('users', function (table) {
        table.dropColumn('is_banned');
    });
};
