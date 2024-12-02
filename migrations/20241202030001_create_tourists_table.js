exports.up = async function (knex) {
    // Tạo bảng tourists
    await knex.schema.createTable('tourists', (table) => {
        table.specificType('tourist_id', 'CHAR(5)').primary(); // tourist_id kiểu CHAR(5)
        table.specificType('user_id', 'CHAR(20)').unique().references('user_id').inTable('users'); // user_id liên kết với bảng users
    });

    // Tạo Trigger Function để thêm bản ghi vào bảng tourists
    await knex.raw(`
        CREATE OR REPLACE FUNCTION insert_into_tourists()
        RETURNS TRIGGER AS $$
        DECLARE
            max_id INTEGER;
        BEGIN
            -- Lấy giá trị tourist_id lớn nhất hiện tại, loại bỏ tiền tố 'ts' và chuyển thành kiểu số
            SELECT COALESCE(MAX(CAST(SUBSTRING(tourist_id FROM 3) AS INTEGER)), 0) + 1
            INTO max_id
            FROM tourists;

            -- Tạo tourist_id mới với tiền tố 'ts' và số tăng dần
            INSERT INTO tourists (tourist_id, user_id)
            VALUES ('ts' || LPAD(max_id::TEXT, 3, '0'), NEW.user_id);

            RETURN NULL; -- Không trả về giá trị vì đây là AFTER INSERT
        END;
        $$ LANGUAGE plpgsql;
    `);

    // Tạo Trigger để gọi Function khi thêm bản ghi vào bảng users
    await knex.raw(`
        CREATE TRIGGER insert_tourist_after_insert_user
        AFTER INSERT ON users
        FOR EACH ROW
        WHEN (NEW.role_id = 2) -- Chỉ thêm vào bảng tourists khi role là 'tourist'
        EXECUTE FUNCTION insert_into_tourists();
    `);
};

exports.down = async function (knex) {
    // Xóa Trigger
    await knex.raw('DROP TRIGGER IF EXISTS after_insert_user ON users;');

    // Xóa Trigger Function
    await knex.raw('DROP FUNCTION IF EXISTS insert_into_tourists;');

    // Xóa bảng tourists
    await knex.schema.dropTableIfExists('tourists');
};
