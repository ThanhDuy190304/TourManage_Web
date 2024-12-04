exports.up = async function (knex) {
    // Kiểm tra và thêm mới constraint cho cart_items
    await knex.raw(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cart_items_quantity_check') THEN
                ALTER TABLE cart_items
                ADD CONSTRAINT cart_items_quantity_check
                CHECK (quantity > 0 AND quantity <= 2);
            END IF;
        END $$;
    `);

    // Kiểm tra và thêm mới constraint cho detail_reservations
    await knex.raw(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'detail_reservations_quantity_check') THEN
                ALTER TABLE detail_reservations
                ADD CONSTRAINT detail_reservations_quantity_check
                CHECK (quantity > 0 AND quantity <= 2);
            END IF;
        END $$;
    `);
};

exports.down = async function (knex) {
    // Xóa constraint cho cart_items
    await knex.raw(`
        ALTER TABLE cart_items
        DROP CONSTRAINT IF EXISTS cart_items_quantity_check;
    `);

    // Xóa constraint cho detail_reservations
    await knex.raw(`
        ALTER TABLE detail_reservations
        DROP CONSTRAINT IF EXISTS detail_reservations_quantity_check;
    `);
};
