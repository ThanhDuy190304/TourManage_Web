/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.dropTableIfExists('detail_reservations');

    await knex.schema.createTable('detail_reservations', (table) => {
        table.specificType('detail_reservation_id', 'CHAR(4)');
        table.specificType('reservation_id', 'VARCHAR(20)').references('reservation_id').inTable('reservations')
            .onDelete(`CASCADE`);
        table.specificType('tour_id', 'CHAR(4)')
        table.specificType('detail_tour_id', 'CHAR(4)')
        table.integer('quantity').defaultTo(1).notNullable().checkPositive();
        table.decimal('total_price', 10, 2);
        table.string('tittle');
        table.date('tourdate');
        table.primary(['reservation_id', 'detail_reservation_id']);
        table.foreign(['tour_id', 'detail_tour_id'])
            .references(['tour_id', 'detail_tour_id'])
            .inTable('detail_tours')
            .onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('detail_reservations');
};
