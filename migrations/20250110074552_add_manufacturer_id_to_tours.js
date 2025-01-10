/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    return await knex.schema.table('tours', function (table) {
        table.integer('manufacturer_id').unsigned().references('id').inTable('manufacturers').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    return await knex.schema.table('tours', function (table) {
        table.dropColumn('manufacturer_id');
    });
};
