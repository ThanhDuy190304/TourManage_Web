/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.raw(`
        CREATE OR REPLACE FUNCTION increment_booked_quantity()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Cập nhật booked_quantity của detail_tours
            UPDATE detail_tours
            SET booked_quantity = booked_quantity + NEW.quantity
            WHERE detail_tour_id = NEW.detail_tour_id
              AND tour_id = NEW.tour_id;

            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    // Tạo trigger
    await knex.raw(`
        CREATE TRIGGER trg_increment_booked_quantity
        AFTER INSERT ON detail_reservations
        FOR EACH ROW
        EXECUTE FUNCTION increment_booked_quantity();
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.raw(`
        DROP TRIGGER IF EXISTS trg_increment_booked_quantity ON detail_reservations;
    `);

    // Xóa trigger function
    await knex.raw(`
        DROP FUNCTION IF EXISTS increment_booked_quantity;
    `);
};
