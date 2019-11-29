
exports.up = function(knex) {
  return knex.schema
    .createTable('bookings', (table)=>{
        table.increments('id').primary()
        table
            .integer('customers_id')
            .unsigned()
            .references('customers.id')
        table.date('c_in_date')
        table.date('c_out_date')
        table.date('date_book')
        table
            .integer('room_id')
            .unsigned()
            .references('rooms.id')
        table.boolean('is_active')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('bookings')
};
