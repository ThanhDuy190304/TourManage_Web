/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.alterTable('detail_tours', (table) => {
        table.dropForeign('tour_id');
        table.foreign('tour_id').references('tour_id').inTable('tours').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.alterTable('detail_tours', (table) => {
        table.dropForeign('tour_id');
        table.foreign('tour_id').references('tour_id').inTable('tours');
    });
};
