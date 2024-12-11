/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Drop the old table
    await knex.schema.dropTableIfExists('cart_items');

    // Create the new table
    await knex.schema.createTable('cart_items', (table) => {
        table.specificType('cart_id', 'CHAR(4)').references('cart_id').inTable('carts');
        table.specificType('tour_id', 'CHAR(4)');
        table.specificType('detail_tour_id', 'CHAR(4)');
        table.integer('quantity').defaultTo(1).notNullable().checkPositive(); // Ensure quantity is > 0
        table.primary(['cart_id', 'tour_id', 'detail_tour_id']); // Composite primary key
        table.timestamps(true, true);
        table.foreign(['tour_id', 'detail_tour_id'])
            .references(['tour_id', 'detail_tour_id'])
            .inTable('detail_tours');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('cart_items');
};
