/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Tạo bảng carts
    await knex.schema.createTable('carts', (table) => {
        table.specificType('cart_id', 'CHAR(4)').primary();
        table.specificType('tourist_id', 'CHAR(5)').unique().references('tourist_id').inTable('tourists').onDelete('CASCADE');
        table.integer('items_count').defaultTo(0);

    });

    // Tạo bảng cart_items
    await knex.schema.createTable('cart_items', (table) => {
        table.specificType('cart_item_id', 'CHAR(4)');
        table.specificType('cart_id', 'CHAR(4)').references('cart_id').inTable('carts').onDelete('CASCADE');
        table.specificType('tour_id', 'CHAR(4)').references('tour_id').inTable('tours').onDelete('CASCADE');
        table.integer('quantity').defaultTo(1);
        table.decimal('price', 10, 2);
        table.check('quantity > 0');
        table.primary(['cart_id', 'cart_item_id']);
    });

    // Tạo bảng reservations
    await knex.schema.createTable('reservations', (table) => {
        table.specificType('reservation_id', 'VARCHAR(20)').primary();
        table.specificType('tourist_id', 'CHAR(5)').references('tourist_id').inTable('tourists').onDelete('CASCADE');
        table.timestamp('reservation_date').defaultTo(knex.fn.now());
        table.enu('status', ['waiting', 'reserved', 'cancel']).notNullable();
    });

    // Tạo bảng detail_reservations
    await knex.schema.createTable('detail_reservations', (table) => {
        table.specificType('detail_reservation_id', 'CHAR(4)');
        table.specificType('reservation_id', 'VARCHAR(20)').references('reservation_id').inTable('reservations');
        table.specificType('tour_id', 'CHAR(4)').references('tour_id').inTable('tours').onDelete('SET NULL');
        table.integer('quantity').defaultTo(1);
        table.decimal('price', 10, 2);
        table.primary(['reservation_id', 'detail_reservation_id']);
        table.check('quantity > 0');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    // Xóa bảng detail_reservations
    await knex.schema.dropTableIfExists('detail_reservations');

    // Xóa bảng reservations
    await knex.schema.dropTableIfExists('reservations');

    // Xóa bảng cart_items
    await knex.schema.dropTableIfExists('cart_items');

    // Xóa bảng carts
    await knex.schema.dropTableIfExists('carts');
};
