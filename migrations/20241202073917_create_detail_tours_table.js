/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Tạo bảng detail_tours
    await knex.schema.createTable('detail_tours', (table) => {
        table.specificType('detail_tour_id', 'CHAR(4)'); // ID chi tiết tour
        table.specificType('tour_id', 'CHAR(4)').references('tour_id').inTable('tours').onDelete('CASCADE'); // Khóa ngoại tham chiếu bảng tours
        table.enu('status', ['not_available', 'available']).notNullable();
        table.date('tour_date').notNullable(); // Ngày tổ chức tour
        table.integer('booked_quantity').defaultTo(0); // Số lượng vé đã đặt
        table.integer('max_quantity').notNullable().checkPositive(); // Số lượng vé tối đa
        table.primary(['tour_id', 'detail_tour_id']); // Khóa chính kết hợp
    });

    // Tạo Function Trigger
    await knex.raw(`
        CREATE OR REPLACE FUNCTION update_status_on_detail_tour()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Kiểm tra nếu số lượng đặt vượt quá số lượng tối đa
            IF NEW.booked_quantity >= NEW.max_quantity THEN
                -- Cập nhật trạng thái thành 'not_available'
                NEW.status := 'not_available';
            END IF;

            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    // Tạo Trigger
    await knex.raw(`
        CREATE TRIGGER trigger_update_status_detail_tours
        AFTER UPDATE ON detail_tours
        FOR EACH ROW
        WHEN (NEW.booked_quantity <> OLD.booked_quantity)
        EXECUTE FUNCTION update_status_on_detail_tour();
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    // Xóa Trigger
    await knex.raw('DROP TRIGGER IF EXISTS trigger_update_status ON detail_tours;');

    // Xóa Function Trigger
    await knex.raw('DROP FUNCTION IF EXISTS update_status_on_booking;');

    // Xóa bảng detail_tours
    await knex.schema.dropTableIfExists('detail_tours');
};
