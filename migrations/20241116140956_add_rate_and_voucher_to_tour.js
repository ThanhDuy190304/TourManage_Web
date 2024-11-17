/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.table('tours', (table) => {
      table.integer('rate').nullable(); // Thêm cột 'rate', kiểu INT, cho phép NULL
      table.float('voucher').nullable(); // Thêm cột 'voucher', kiểu FLOAT, cho phép NULL
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.table('tours', (table) => {
      table.dropColumn('rate'); // Xóa cột 'rate'
      table.dropColumn('voucher'); // Xóa cột 'voucher'
    });
  };
