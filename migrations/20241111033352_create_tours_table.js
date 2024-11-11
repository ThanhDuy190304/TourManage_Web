/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('tours', (table) => {
        table.specificType('tour_id', 'char(4)').primary();
        table.string('title', 50).notNullable().unique();
        table.string('brief');
        table.specificType('details', 'text');
        table.specificType('location_id', 'char(4)');
        table.decimal('prices', 10, 1);

        // Foreign key to 'locations' table
        table.foreign('location_id').references('location_id').inTable('locations').onDelete('CASCADE');
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('tours');
};
