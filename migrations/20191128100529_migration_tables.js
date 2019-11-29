
exports.up = function(knex) {
  return knex.schema
    .createTable('rooms', (table)=>{
        table.increments('id').primary()
        table.string('type_room')
        table.string('description')
        table.string('image')
        table.integer('quantity')
        table.bigInteger('price')
        table.boolean('enable')
    })

};

exports.down = function(knex) {
    return knex.schema.dropTable('rooms')
};
