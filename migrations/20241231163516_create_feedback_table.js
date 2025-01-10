/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('feedbacks', (table) => {
        table.increments('feedback_id'); // ID tự tăng cho bảng feedback
        table.specificType('tourist_id',' char(5)').unsigned().notNullable(); // Liên kết đến bảng users
        table.specificType('tour_id','char(4)').unsigned().notNullable(); // Liên kết đến bảng tours
        table.integer('star').notNullable().checkBetween([1, 5]); // Số sao đánh giá (1-5)
        table.text('rate').notNullable(); // Nội dung đánh giá
        table.date('dateofreview').notNullable(); // Ngày đánh giá
        table.foreign('tourist_id').references('tourist_id').inTable('tourists').onDelete('CASCADE');
        table.foreign('tour_id').references('tour_id').inTable('tours').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('feedbacks');
};
