/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    return await knex.schema.table('profile_users', function (table) {
        table.string('avatar').notNullable().defaultTo('https://i.imgur.com/smkovG8.png');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    return await knex.schema.table('profile_users', function (table) {
        table.dropColumn('avatar');
    });
};
