/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    return await knex.raw(`
    -- Tạo trigger function để cập nhật items_count trong bảng carts khi có sự thay đổi trong cart_items
    CREATE OR REPLACE FUNCTION update_cart_item_count()
    RETURNS TRIGGER AS $$
    BEGIN
        -- Nếu là INSERT
        IF TG_OP = 'INSERT' THEN
            -- Cập nhật số lượng item trong cart tương ứng với cart_id
            UPDATE carts
            SET items_count = items_count + 1
            WHERE cart_id = NEW.cart_id;
            RETURN NEW;

        -- Nếu là DELETE
        ELSIF TG_OP = 'DELETE' THEN
            -- Giảm số lượng item trong cart tương ứng với cart_id
            UPDATE carts
            SET items_count = items_count - 1
            WHERE cart_id = OLD.cart_id;
            RETURN OLD;
        END IF;
    END;
    $$ LANGUAGE plpgsql;

    -- Tạo trigger để gọi trigger function khi có sự thay đổi trong bảng cart_items
    CREATE TRIGGER update_cart_item_count_trigger
    AFTER INSERT OR DELETE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_cart_item_count();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    return await knex.raw(`
    -- Xóa trigger và trigger function nếu cần rollback migration
    DROP TRIGGER IF EXISTS update_cart_item_count_trigger ON cart_items;
    DROP FUNCTION IF EXISTS update_cart_item_count;
  `);
};
