/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Tạo sequence để sinh giá trị tự động
    await knex.raw(`
        CREATE SEQUENCE detail_reservation_id_seq
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    `);

    // Tạo trigger function để sinh giá trị cho khóa chính
    await knex.raw(`
        CREATE OR REPLACE FUNCTION set_detail_reservation_id() 
        RETURNS TRIGGER AS $$
        BEGIN
            -- Sinh giá trị khóa chính từ sequence và định dạng thành '0001', '0002', ...
            NEW.detail_reservation_id := LPAD(nextval('detail_reservation_id_seq')::text, 4, '0');
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    // Tạo trigger trước khi thêm bản ghi mới
    await knex.raw(`
        CREATE TRIGGER before_insert_detail_reservation
        BEFORE INSERT ON detail_reservations
        FOR EACH ROW
        EXECUTE FUNCTION set_detail_reservation_id();
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    // Xóa trigger
    await knex.raw(`
        DROP TRIGGER IF EXISTS before_insert_detail_reservation ON detail_reservations;
    `);

    // Xóa function
    await knex.raw(`
        DROP FUNCTION IF EXISTS set_detail_reservation_id;
    `);

    // Xóa sequence
    await knex.raw(`
        DROP SEQUENCE IF EXISTS detail_reservation_id_seq;
    `);
};
