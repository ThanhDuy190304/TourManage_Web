exports.up = async function (knex) {
    return await knex.schema.table('tours', function (table) {
        // Xóa constraint cũ (tours_location_id_foreign)
        table.dropForeign('location_id', 'tours_location_id_foreign');

        // Thêm constraint mới với ON DELETE SET NULL
        table.foreign('location_id')
            .references('location_id')
            .inTable('locations')
            .onDelete('SET NULL');
    });
};

exports.down = async function (knex) {
    return await knex.schema.table('tours', function (table) {
        // Xóa foreign key nếu cần
        table.dropForeign('location_id');

        // Khôi phục lại constraint cũ (ON DELETE CASCADE)
        table.foreign('location_id')
            .references('location_id')
            .inTable('locations')
            .onDelete('CASCADE');
    });
};
