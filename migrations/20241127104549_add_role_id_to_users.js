/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Tạo lại hàm insertAccountFunction nếu cần
    await knex.raw(`
    CREATE OR REPLACE FUNCTION insertAccountFunction()
    RETURNS TRIGGER AS $$ 
    BEGIN
        -- Nếu user_id không có, gán giá trị tự động
        IF NEW.user_id IS NULL THEN
            NEW.user_id := generateUserId();
        END IF;

        -- Nếu role_id không có, gán mặc định là 2
        IF NEW.role_id IS NULL THEN
            NEW.role_id := 2;
        END IF;

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

    // Cập nhật hoặc tạo trigger nếu chưa có
    await knex.raw(`
    CREATE OR REPLACE TRIGGER insertAccount
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
    // Xóa trigger insertAccount
    await knex.raw(`DROP TRIGGER IF EXISTS insertAccount ON users`);

    // Xóa hàm insertAccountFunction
    await knex.raw(`DROP FUNCTION IF EXISTS insertAccountFunction`);
};
