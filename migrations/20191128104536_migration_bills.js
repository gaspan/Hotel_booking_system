
exports.up = function(knex) {
  return knex.schema
    .createTable('bills',(table)=>{
        table.increments('id').primary()
        table
            .integer('booking_id')
            .unsigned()
            .references('bookings.id')
        table.bigInteger('total')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('bills')
};
