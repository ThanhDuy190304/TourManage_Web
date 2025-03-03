/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    // Thêm cột 'salt' vào bảng 'users'
    await knex.schema.table('users', function (table) {
        table.string('salt', 64);
    });

    // Thêm cột 'salt' vào bảng 'pending_users'
    await knex.schema.table('pending_users', function (table) {
        table.string('salt', 64);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.table('users', function (table) {
        table.dropColumn('salt');
    });

    // Xóa cột 'salt' trong bảng 'pending_users'
    await knex.schema.table('pending_users', function (table) {
        table.dropColumn('salt');
    });
};
