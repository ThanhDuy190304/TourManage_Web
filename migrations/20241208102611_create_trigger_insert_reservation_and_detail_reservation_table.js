/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Tạo sequence cho reservation_id và detail_reservation_id
    await knex.raw(`
        CREATE SEQUENCE IF NOT EXISTS reservations_id_seq
        START WITH 1
        INCREMENT BY 1;
    `);

    await knex.raw(`
        CREATE SEQUENCE IF NOT EXISTS detail_reservations_id_seq
        START WITH 1
        INCREMENT BY 1;
    `);

    // Tạo function tự động điền reservation_id cho bảng reservations
    await knex.raw(`
        CREATE OR REPLACE FUNCTION generate_reservation_id()
        RETURNS trigger AS $$
        BEGIN
            NEW.reservation_id := 'r' || LPAD(nextval('reservations_id_seq')::text, 19, '0');
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    // Tạo trigger cho bảng reservations
    await knex.raw(`
        CREATE TRIGGER set_reservation_id
        BEFORE INSERT ON reservations
        FOR EACH ROW
        EXECUTE FUNCTION generate_reservation_id();
    `);

    // Tạo function tự động điền detail_reservation_id cho bảng detail_reservations
    await knex.raw(`
        CREATE OR REPLACE FUNCTION generate_detail_reservation_id()
        RETURNS trigger AS $$
        BEGIN
            NEW.detail_reservation_id := LPAD(nextval('detail_reservations_id_seq')::text, 4, '0');
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    // Tạo trigger cho bảng detail_reservations
    await knex.raw(`
        CREATE TRIGGER set_detail_reservation_id
        BEFORE INSERT ON detail_reservations
        FOR EACH ROW
        EXECUTE FUNCTION generate_detail_reservation_id();
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    // Xoá trigger và function cho bảng reservations
    await knex.raw('DROP TRIGGER IF EXISTS set_reservation_id ON reservations');
    await knex.raw('DROP FUNCTION IF EXISTS generate_reservation_id');

    // Xoá trigger và function cho bảng detail_reservations
    await knex.raw('DROP TRIGGER IF EXISTS set_detail_reservation_id ON detail_reservations');
    await knex.raw('DROP FUNCTION IF EXISTS generate_detail_reservation_id');

    // Xoá các sequence
    await knex.raw('DROP SEQUENCE IF EXISTS reservations_id_seq');
    await knex.raw('DROP SEQUENCE IF EXISTS detail_reservations_id_seq');
};
