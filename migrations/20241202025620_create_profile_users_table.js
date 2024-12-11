exports.up = async function (knex) {
    // Tạo bảng profile_users
    await knex.schema.createTable('profile_users', (table) => {
        table.specificType('profile_user_id', 'CHAR(20)').primary();  // Khóa chính là profile_user_id kiểu CHAR(4)
        table.specificType('user_id', 'CHAR(20)').unique().references('user_id').inTable('users');  // Khóa ngoại liên kết với bảng users
        table.string('user_fullname', 100);  // Tên người dùng
        table.date('user_birthday');  // Ngày sinh người dùng
        table.string('user_contact', 50);  // Liên lạc người dùng
        table.string('user_address', 100);  // Địa chỉ người dùng
    });

    // Tạo Trigger Function
    await knex.raw(`
        CREATE OR REPLACE FUNCTION insert_profile_user_after_user()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Tạo profile_user_id từ user_id, loại bỏ chữ 'u' và lấy phần còn lại
            INSERT INTO profile_users (user_id, profile_user_id)
            VALUES (NEW.user_id, substring(NEW.user_id from 2));  -- Bỏ ký tự đầu tiên (chữ 'u')
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);

    // Tạo Trigger
    await knex.raw(`
        CREATE TRIGGER insert_profile_after_insert_user
        AFTER INSERT ON users
        FOR EACH ROW
        EXECUTE FUNCTION insert_profile_user_after_user();
    `);
};

exports.down = async function (knex) {
    // Xóa trigger
    await knex.raw('DROP TRIGGER IF EXISTS after_insert_user ON users;');

    // Xóa trigger function
    await knex.raw('DROP FUNCTION IF EXISTS insert_profile_user_after_user;');

    // Xóa bảng profile_users
    await knex.schema.dropTableIfExists('profile_users');
};
