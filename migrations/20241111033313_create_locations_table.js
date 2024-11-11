/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('locations', (table) => {
        table.specificType('location_id', 'char(4)').primary();
        table.string('location_name', 50).notNullable().unique();
        table.specificType('details', 'text');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('locations');
};
