/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`
    CREATE SEQUENCE location_id_seq
    START WITH 10
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
  `);

  // Tạo function để sinh location_id tự động
  await knex.raw(`
    CREATE OR REPLACE FUNCTION generate_location_id()
    RETURNS trigger AS
    $$
    BEGIN
        NEW.location_id := 'l' || LPAD(nextval('location_id_seq')::text, 3, '0');
        RETURN NEW;
    END;
    $$
    LANGUAGE plpgsql;
  `);

  // Tạo trigger để gọi function trước khi thêm bản ghi
  await knex.raw(`
    CREATE TRIGGER set_location_id
    BEFORE INSERT ON locations
    FOR EACH ROW
    EXECUTE FUNCTION generate_location_id();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`
    DROP TRIGGER IF EXISTS set_location_id ON locations;
  `);
  await knex.raw(`
    DROP FUNCTION IF EXISTS generate_location_id;
  `);
  await knex.raw(`
    DROP SEQUENCE IF EXISTS location_id_seq;
  `);
};
