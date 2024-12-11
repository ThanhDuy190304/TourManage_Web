/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.raw(`
    CREATE OR REPLACE FUNCTION create_cart_after_tourist_insert()
    RETURNS TRIGGER AS $$
    DECLARE
        new_cart_id CHAR(4);
    BEGIN
        -- Lấy số từ tourist_id
        new_cart_id := 'c' || SUBSTRING(NEW.tourist_id FROM 3);

        -- Thêm bản ghi mới vào bảng carts
        INSERT INTO carts (cart_id, tourist_id, items_count)
        VALUES (new_cart_id, NEW.tourist_id, 0);

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    `);


    await knex.raw(`
    CREATE TRIGGER trigger_create_cart
    AFTER INSERT ON tourists
    FOR EACH ROW
    EXECUTE FUNCTION create_cart_after_tourist_insert();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    // Xóa trigger
    await knex.raw(`
    DROP TRIGGER IF EXISTS trigger_create_cart ON tourists;
  `);

    // Xóa function
    await knex.raw(`
    DROP FUNCTION IF EXISTS create_cart_after_tourist_insert();
  `);
};
