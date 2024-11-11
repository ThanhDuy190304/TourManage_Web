/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Tạo bảng users
    await knex.schema.createTable('users', (table) => {
        table.specificType('user_id', 'char(20)').primary();
        table.string('user_name', 50).notNullable().unique();
        table.string('email', 100).notNullable().unique();
        table.string('user_password', 20).notNullable();
    });

    // Tạo hàm generateUserId()
    await knex.raw(`
    CREATE OR REPLACE FUNCTION generateUserId() RETURNS CHAR(4) AS $$
    DECLARE
        available_id RECORD;
        cur CURSOR FOR 
            WITH ids AS (
                SELECT 'u' || LPAD(g::TEXT, 3, '0') AS user_id
                FROM generate_series(1, 999) g
            )
            SELECT ids.user_id
            FROM ids
            LEFT JOIN users ON ids.user_id = users.user_id
            WHERE users.user_id IS NULL
            ORDER BY ids.user_id
            LIMIT 1;
    BEGIN
        OPEN cur;
        FETCH cur INTO available_id;
        CLOSE cur;

        IF FOUND THEN
            RETURN available_id.user_id;
        ELSE
            RAISE EXCEPTION 'Không thể tạo user_id mới, bảng đã đầy';
        END IF;
    END;
    $$ LANGUAGE plpgsql;
  `);

    // Tạo hàm insertAccountFunction()
    await knex.raw(`
    CREATE OR REPLACE FUNCTION insertAccountFunction()
    RETURNS TRIGGER AS $$
    BEGIN
        IF NEW.user_id IS NULL THEN
            NEW.user_id := generateUserId();
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

    // Tạo Trigger insertAccount
    await knex.raw(`
    CREATE TRIGGER insertAccount
    BEFORE INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION insertAccountFunction();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    // Xóa Trigger insertAccount
    await knex.raw(`DROP TRIGGER IF EXISTS insertAccount ON users`);

    // Xóa hàm insertAccountFunction
    await knex.raw(`DROP FUNCTION IF EXISTS insertAccountFunction`);

    // Xóa hàm generateUserId
    await knex.raw(`DROP FUNCTION IF EXISTS generateUserId`);

    // Xóa bảng users
    await knex.schema.dropTableIfExists('users');
};
