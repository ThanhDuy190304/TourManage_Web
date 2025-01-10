/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.raw(`
    CREATE OR REPLACE FUNCTION delete_refresh_token_when_banned()
    RETURNS TRIGGER AS $$
    BEGIN
        IF NEW.is_banned = TRUE AND OLD.is_banned = FALSE THEN
            DELETE FROM refresh_tokens
            WHERE user_id = NEW.user_id;
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);
    await knex.raw(`
    CREATE TRIGGER trigger_delete_refresh_token
    AFTER UPDATE OF is_banned ON users
    FOR EACH ROW
    WHEN (NEW.is_banned = TRUE)
    EXECUTE FUNCTION delete_refresh_token_when_banned();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    // Xóa trigger
    await knex.raw(`
    DROP TRIGGER IF EXISTS trigger_delete_refresh_token ON users;
  `);

    // Xóa function
    await knex.raw(`
    DROP FUNCTION IF EXISTS delete_refresh_token_when_banned();
  `);
};
