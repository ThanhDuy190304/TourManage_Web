/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('tour_images', (table) => {
        table.increments('img_id'); // Auto-incrementing ID
        table.specificType('tour_id', 'char(4)'); // Tour ID

        table.string('img_url');

        // Foreign key to 'tours' table
        table.foreign('tour_id').references('tour_id').inTable('tours').onDelete('CASCADE');

        // Setting composite primary key
        table.primary(['img_id', 'tour_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('tour_images');
};